const webhookService = require('../../services/Order/order.webhook');
const { sendResponse, sendError } = require('../../utils/controller.util');
const logger = require('../../utils/logger.util');

/**
 * Contrôleur pour réceptionner les Webhooks Stripe (Phase 2)
 */
const handleWebhook = async (req, res) => {
    try {
        const rawBody = req.rawBody;
        const signature = req.headers['stripe-signature'];

        if (!rawBody) {
            logger.error('rawBody manquant. Modifiez app.use(bodyParser) dans app.js');
            return sendError(res, 400, 'Bad Request: rawBody manquant');
        }

        if (!signature) {
            logger.error('Signature Stripe manquante dans les headers');
            return sendError(res, 400, 'Bad Request: Signature manquante');
        }

        // Appel au service
        await webhookService(rawBody, signature);

        // Stripe attend une réponse 200 OK pour confirmer la réception
        return sendResponse(res, 200, 'Webhook received', {});
    } catch (error) {
        // Si la vérification échoue (mauvaise signature, secret invalide), on renvoie une 400
        return sendError(res, 400, error.message);
    }
};

module.exports = handleWebhook;
