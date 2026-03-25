const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../../models/Order");
const { handleResponse } = require("../../utils/controller.util");

const verifyCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return handleResponse(res, 400, "Session ID manquant");
    }

    // 1. Récupérer la session depuis Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return handleResponse(res, 404, "Session Stripe introuvable");
    }

    // 2. Extraire l'orderId des métadonnées
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return handleResponse(res, 400, "Aucune commande associée à cette session");
    }

    // 3. Récupérer la commande en base de données
    const order = await Order.findById(orderId);
    if (!order) {
      return handleResponse(res, 404, "Commande introuvable en base de données");
    }

    // 4. Sécurité : vérifier que l'utilisateur est bien le propriétaire
    const userId = req.user.id || req.user._id?.toString();
    if (order.userId.toString() !== userId && req.user.role !== "admin") {
      return handleResponse(res, 403, "Accès refusé");
    }

    // 5. Retourner l'état consolidé de la commande
    return handleResponse(res, 200, "Statut de la commande récupéré", {
      status: order.status,
      payment_status: session.payment_status,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification de la session:", error);
    return handleResponse(res, 500, error.message);
  }
};

module.exports = verifyCheckoutSession;
