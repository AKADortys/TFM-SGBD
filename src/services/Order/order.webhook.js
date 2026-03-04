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
const handleWebhook = async (rawBody, signature) => {
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

    // ==========================================
    // 1. VÉRIFICATION D'IDEMPOTENCE
    // ==========================================
    const order = await Order.findById(orderId);
    if (!order) {
      logger.error(`Commande ${orderId} introuvable en base de données.`);
      return { success: true };
    }

    if (order.status === "Confirmée") {
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
      // Mise à jour du statut
      order.status = "Confirmée";
      await order.save({ session: dbSession });

      // Mise à jour atomique des stocks avec un pipeline d'agrégation (MongoDB 4.2+)
      const stockUpdatePromises = order.products.map((item) => {
        return Product.updateOne(
          { _id: item.productId },
          [
            // Étape 1 : Décrémenter le stock
            { $set: { stock: { $subtract: ["$stock", item.quantity] } } },
            // Étape 2 : Mettre à jour 'available' dynamiquement selon le nouveau stock
            { $set: { available: { $gt: ["$stock", 0] } } },
          ],
          { session: dbSession },
        );
      });

      await Promise.all(stockUpdatePromises);

      // Validation de la transaction
      await dbSession.commitTransaction();
      logger.info(
        `Commande ${orderId} validée et stocks mis à jour (Transaction OK).`,
      );
    } catch (dbError) {
      // Annulation en cas d'erreur
      await dbSession.abortTransaction();
      logger.error(
        `Erreur DB (Transaction annulée) pour la commande ${orderId}: ${dbError.message}`,
      );
      throw new Error(`Erreur critique de base de données: ${dbError.message}`);
    } finally {
      // On ferme toujours la session
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
  } else {
    logger.info(`Événement Stripe non géré ignoré: ${event.type}`);
  }

  return { success: true };
};

module.exports = handleWebhook;
