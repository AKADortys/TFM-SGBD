const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose"); // Requis pour les transactions
const logger = require("../../utils/logger.util");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const mailService = require("../mail.service");
const { getUserById } = require("../user.index");

/**
 * Service pour gérer les Webhooks Stripe (Sécurisé & Idempotent)
 */
const handleWebhook = async (rawBody, signature, io) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error("STRIPE_WEBHOOK_SECRET n'est pas défini !");
    throw new Error("Erreur de configuration du serveur");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    logger.error(`Erreur de signature Webhook Stripe: ${err.message}`);
    throw new Error(`Erreur Webhook: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      logger.warn(
        `Aucun orderId trouvé dans les metadata de la session ${sessionId}`,
      );
      return { success: true }; // On retourne true pour que Stripe arrête d'essayer
    }

    if (session.payment_status !== "paid") {
      logger.info(
        `Session ${sessionId} terminée mais paiement non validé (statut: ${session.payment_status}).`
      );
      return { success: true }; 
    }

    // ==========================================
    // 1. VÉRIFICATION D'IDEMPOTENCE
    // ==========================================
    const order = await Order.findById(orderId);
    if (!order) {
      logger.error(`Commande ${orderId} introuvable en base de données.`);
      return { success: true };
    }

    if (order.status === "Payée") {
      logger.info(
        `Idempotence: La commande ${orderId} a déjà été traitée avec succès.`,
      );
      return { success: true }; // Évite la double décrémentation des stocks
    }
    // ==========================================
    // 2. TRANSACTION MONGODB (Propriétés ACID)
    // ==========================================
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      // Mise à jour atomique des stocks avec vérification préalable
      for (const item of order.products) {
        const result = await Product.updateOne(
          {
            _id: item.productId,
            stock: { $gte: item.quantity }, // CONDITION CLÉ : Le stock DOIT être supérieur ou égal à la quantité demandée
          },
          [
            // Étape 1 : Décrémenter le stock
            { $set: { stock: { $subtract: ["$stock", item.quantity] } } },
            // Étape 2 : Mettre à jour 'available' dynamiquement selon le nouveau stock
            { $set: { available: { $gt: ["$stock", 0] } } },
          ],
          { session: dbSession },
        );

        // Si modifiedCount est 0, le produit n'existe plus OU le stock est devenu insuffisant entre-temps
        if (result.modifiedCount === 0) {
          throw new Error(
            `OversellingError: Stock insuffisant pour le produit ${item.productId}`,
          );
        }
      }

      // Si toutes les vérifications passent, on confirme la commande
      order.status = "Payée";
      await order.save({ session: dbSession });

      // Validation de la transaction
      await dbSession.commitTransaction();
      logger.info(
        `Commande ${orderId} validée et stocks mis à jour (Transaction OK).`,
      );

      // Notification WebSockets via Socket.io
      if (io) {
        io.emit('admin_new_order', { orderId: order._id, status: order.status });
        io.to(`user_${order.userId}`).emit('order_status_updated', { orderId: order._id, status: order.status });
      }
    } catch (dbError) {
      // Annulation de TOUTE la transaction (les stocks ne sont pas touchés)
      await dbSession.abortTransaction();

      // Gestion spécifique de l'erreur de survente
      if (dbError.message.includes("OversellingError")) {
        logger.error(
          `Survente détectée pour la commande ${orderId}. Lancement de la procédure d'annulation.`,
        );

        // 1. Mettre la commande en statut "Annulée" hors transaction
        order.status = "Annulée";
        await order.save(); // On sauvegarde hors de la session annulée

        // 2. Rembourser automatiquement le client via Stripe
        if (session.payment_intent) {
          await stripe.refunds.create({
            payment_intent: session.payment_intent,
            reason: "requested_by_customer", // ou laisser vide
          });
          logger.info(
            `Remboursement Stripe effectué pour la commande ${orderId}`,
          );
        }

        // 3. (Optionnel) Envoyer un mail au client pour s'excuser de la rupture de stock
        // await mailService.stockError(order, user);

        return { success: true }; // On dit à Stripe que c'est OK pour qu'il ne renvoie pas le webhook
      }

      // Si c'est une autre erreur DB critique, on propage
      logger.error(
        `Erreur DB (Transaction annulée) pour la commande ${orderId}: ${dbError.message}`,
      );
      throw new Error(`Erreur critique de base de données: ${dbError.message}`);
    } finally {
      dbSession.endSession();
    }

    // ==========================================
    // 3. GESTION DES NOTIFICATIONS (Isolée)
    // ==========================================
    try {
      const user = await getUserById(order.userId);
      if (user) {
        await mailService.newOrder(order, user);
        logger.info(
          `Email de confirmation envoyé pour la commande ${orderId}.`,
        );
      }
    } catch (mailError) {
      // Si l'email échoue, on ne fait pas planter le Webhook, la commande est déjà validée
      logger.error(
        `Échec de l'envoi de l'email pour la commande ${orderId}: ${mailError.message}`,
      );
    }
  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      try {
        const order = await Order.findById(orderId);
        if (order && order.status === "En attente") {
          order.status = "Annulée";
          await order.save();
          logger.info(
            `Session Stripe expirée (checkout.session.expired). La commande ${orderId} en attente a été annulée.`
          );
        }
      } catch (err) {
        logger.error(`Erreur lors de l'annulation de la commande expirée ${orderId}: ${err.message}`);
      }
    }
  } else {
    logger.info(`Événement Stripe non géré ignoré: ${event.type}`);
  }

  return { success: true };
};

module.exports = handleWebhook;
