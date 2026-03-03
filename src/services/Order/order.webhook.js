const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../../utils/logger.util');

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

            logger.info(`Paiement réussi pour la session ${sessionId}. Email du client: ${customerEmail}`);

            // TODO: Implémenter la logique pour mettre à jour la base de données
            // Exemple :
            // await OrderModel.findOneAndUpdate(
            //   { stripeSessionId: sessionId }, 
            //   { status: 'Payée' }
            // );

            break;

        // Tu peux ajouter d'autres événements Stripe si nécessaire (ex: payment_intent.payment_failed)
        default:
            logger.info(`Événement Stripe non géré ignoré: ${event.type}`);
    }

    return { success: true };
};

module.exports = handleWebhook;
