const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../../utils/logger.util');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

/**
 * Service pour gérer les Webhooks Stripe (Phase 2)
 *
 * @param {Buffer} rawBody - Le corps brut de la requête (requis pour vérifier la signature)
 * @param {string} signature - La signature envoyée par Stripe dans les headers (`stripe-signature`)
 * @returns {object} - Résultat du traitement
 */
const handleWebhook = async (rawBody, signature) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        logger.error("STRIPE_WEBHOOK_SECRET n'est pas défini !");
        throw new Error('Erreur de configuration du serveur');
    }

    let event;

    try {
        // Vérification cryptographique de la signature Stripe avec le rawBody
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
        logger.error(`Erreur de signature Webhook Stripe: ${err.message}`);
        throw new Error(`Erreur Webhook: ${err.message}`);
    }

    // Traitement de l'événement en fonction de son type
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            const customerEmail = session.customer_details?.email;
            const sessionId = session.id;
            const orderId = session.metadata?.orderId;

            logger.info(`Paiement réussi pour la session ${sessionId}. Email du client: ${customerEmail}`);

            if (orderId) {
                // Mise à jour du statut de la commande dans la base de données
                try {
                    const updatedOrder = await Order.findByIdAndUpdate(
                        orderId,
                        { status: 'Confirmée' },
                        { new: true }
                    );

                    if (updatedOrder) {
                        logger.info(`Commande ${orderId} validée avec succès en base de données.`);

                        // --- Mise à jour du stock des produits ---
                        try {
                            const stockUpdatePromises = updatedOrder.products.map(async (item) => {
                                // Décrémenter le stock
                                const updatedProduct = await Product.findByIdAndUpdate(
                                    item.productId,
                                    { $inc: { stock: -item.quantity } },
                                    { new: true }
                                );

                                // Si le stock tombe à 0 ou moins, on le rend indisponible (une autre sécurité en plus du hook Mongoose)
                                if (updatedProduct && updatedProduct.stock <= 0) {
                                    updatedProduct.available = false;
                                    await updatedProduct.save();
                                }
                            });

                            await Promise.all(stockUpdatePromises);
                            logger.info(`Stocks mis à jour avec succès pour la commande ${orderId}.`);
                        } catch (stockError) {
                            // On loggue l'erreur pour ne pas faire planter Stripe mais alerter l'admin
                            logger.error(`Erreur lors de la mise à jour des stocks (Commande ${orderId}): ${stockError.message}`);
                        }
                    } else {
                        logger.warn(`Commande ${orderId} introuvable dans la base de données après paiement.`);
                    }
                } catch (dbError) {
                    logger.error(`Erreur lors de la mise à jour de la commande ${orderId}: ${dbError.message}`);
                    throw new Error(`Erreur DB: ${dbError.message}`);
                }
            } else {
                logger.warn(`Aucun orderId trouvé dans les metadata de la session ${sessionId}`);
            }

            break;

        // Tu peux ajouter d'autres événements Stripe si nécessaire (ex: payment_intent.payment_failed)
        default:
            logger.info(`Événement Stripe non géré ignoré: ${event.type}`);
    }

    return { success: true };
};

module.exports = handleWebhook;
