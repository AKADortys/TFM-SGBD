const orderServices = require("../../services/orders.index");
// Adapte le chemin vers utils si besoin
const { handleResponse } = require("../../utils/controller.util");

const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const userEmail = req.user.mail;

    if (!cartItems || cartItems.length === 0) {
      return handleResponse(
        res,
        400,
        "Le panier est vide, impossible de créer une session.",
      );
    }

    // Appel au service
    const url = await orderServices.createCheckoutSession(cartItems, userEmail);

    // On renvoie l'URL au front-end Angular
    return handleResponse(res, 200, "Session de paiement créée", { url });
  } catch (error) {
    return handleResponse(res, 500, error.message);
  }
};

module.exports = createCheckoutSession;
