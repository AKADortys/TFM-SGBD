const orderServices = require("../../services/orders.index");
const { getByIds } = require("../../services/product.index");
const Order = require("../../models/Order");
const { handleResponse, isObjectId } = require("../../utils/controller.util");

const resumeCheckoutSession = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userEmail = req.user.mail;
    const userId = req.user._id || req.user.id;

    if (isObjectId(orderId)) {
      return handleResponse(res, 400, "ID de commande invalide :" + orderId);
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return handleResponse(res, 404, "Commande introuvable");
    }

    if (order.userId.toString() !== userId.toString()) {
      return handleResponse(res, 403, "Vous n'êtes pas autorisé à reprendre cette commande");
    }

    if (order.status !== "En attente") {
      return handleResponse(res, 400, "Seule une commande en attente peut être reprise");
    }

    if (!order.products || order.products.length === 0) {
      return handleResponse(res, 400, "La commande est vide");
    }

    // Vérification des stocks avant de renvoyer vers Stripe (Optimisation N+1)
    const productIds = order.products.map((p) => p.productId);
    const existingProducts = await getByIds(productIds);

    for (const element of order.products) {
      const exist = existingProducts.find((p) => p._id.toString() === element.productId.toString());

      if (!exist) {
        return handleResponse(res, 400, "Produit inexistant :" + element.productId);
      }

      if (element.quantity > exist.stock) {
        return handleResponse(
          res,
          400,
          `Quantité insuffisante pour le produit ${exist.label || element.productName}. Stock disponible : ${exist.stock}, quantité demandée : ${element.quantity}.`
        );
      }
    }

    // Appel au service pour générer la session avec la commande existante
    const url = await orderServices.resumeCheckoutSession(order, userEmail);

    // On renvoie l'URL au front-end Angular
    return handleResponse(res, 200, "Session de paiement reprise", { url });
  } catch (error) {
    console.error("Erreur lors de la reprise de la session checkout:", error);
    return handleResponse(res, 500, error.message);
  }
};

module.exports = resumeCheckoutSession;
