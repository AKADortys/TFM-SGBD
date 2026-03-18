const orderServices = require("../../services/orders.index");
const { getById, getByIds } = require("../../services/product.index");
const { createOrderSchema } = require("../../dto/order.dto");
const { handleResponse, isObjectId } = require("../../utils/controller.util");

const createCheckoutSession = async (req, res) => {
  try {
    // 1. Validation du body avec le DTO (allowUnknown pour accepter "name" du front-end sans bloquer)
    const { error, value } = createOrderSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    const { products, deliveryAddress } = value;
    const userEmail = req.user.mail;
    const userId = req.user._id || req.user.id;

    if (!products || products.length === 0) {
      return handleResponse(
        res,
        400,
        "Le panier est vide, impossible de créer une session."
      );
    }

    // 2. Vérification des produits et des stocks en Base de données (Optimisation N+1)
    const productIds = products.map((p) => p.productId);

    for (const id of productIds) {
      if (isObjectId(id)) {
        return handleResponse(res, 400, "ID produit invalide :" + id);
      }
    }

    const existingProducts = await getByIds(productIds);

    for (const element of products) {
      const exist = existingProducts.find((p) => p._id.toString() === element.productId);

      if (!exist) {
        return handleResponse(res, 400, "Produit inexistant :" + element.productId);
      }

      if (element.quantity > exist.stock) {
        return handleResponse(
          res,
          400,
          `Quantité insuffisante pour le produit ${exist.label}. Stock disponible : ${exist.stock}, quantité demandée : ${element.quantity}.`
        );
      }

      // SÉCURITÉ : on écrase le prix et le nom envoyés par le front par la réalité de la base de données
      element.price = exist.price;
      element.productName = exist.label;
    }

    // 3. Appel au service pour générer la session avec les vraies données
    const url = await orderServices.createCheckoutSession(products, deliveryAddress, userId, userEmail);

    // 4. On renvoie l'URL au front-end Angular
    return handleResponse(res, 200, "Session de paiement créée", { url });
  } catch (error) {
    console.error("Erreur lors de la création de la session checkout:", error);
    return handleResponse(res, 500, error.message);
  }
};

module.exports = createCheckoutSession;
