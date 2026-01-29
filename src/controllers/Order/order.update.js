const orderService = require("../../services/orders.index");
const productService = require("../../services/product.index");
const mailService = require("../../services/mail.service");
const userService = require("../../services/user.index");
const { updateOrderSchema } = require("../../dto/order.dto");
const { isObjectId, handleResponse } = require("../../utils/controller.util");

// Modification d'une commande
module.exports = async (req, res) => {
  try {
    // vérification de l'ID de la commande et de l'existence de la commande
    const { id } = req.params;
    const idError = isObjectId(id);
    if (idError) return handleResponse(res, 400, idError);
    const existingOrder = await orderService.getById(id);
    if (!existingOrder) {
      return handleResponse(res, 404, "Commande non trouvée");
    }
    // Vérification des droits d'accès
    if (
      req.user.id !== existingOrder.userId?.toString() &&
      req.user.role !== "admin"
    ) {
      return handleResponse(res, 403, "Accès refusé");
    }
    // Vérification du statut de la commande

    const modifiableStatuses = ["En attente", "Confirmée"];
    if (!modifiableStatuses.includes(existingOrder.status)) {
      return handleResponse(
        res,
        400,
        `La commande ne peut pas être modifiée car son statut est "${existingOrder.status}"`,
      );
    }
    // Validation des données entrantes
    const { error, value } = updateOrderSchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }
    let { totalPrice } = existingOrder;
    // Si les produits sont modifiés, vérifier leur existence et recalculer le prix total
    if (value.products) {
      const docs = await Promise.all(
        value.products.map((p) => productService.getById(p.productId)),
      );
      if (docs.some((d) => !d)) {
        return handleResponse(res, 400, "Produit inexistant");
      }
      // Normalisation des produits avec les prix actuels
      const normalized = value.products.map((p, i) => ({
        productId: p.productId,
        quantity: p.quantity,
        price: docs[i].price,
      }));
      value.products = normalized;
      totalPrice = normalized.reduce((sum, p) => sum + p.price * p.quantity, 0);
    }
    // Mise à jour de la commande
    const updatedFields = {
      userId: value.userId ?? existingOrder.userId,
      products: value.products ?? existingOrder.products,
      deliveryAddress: value.deliveryAddress ?? existingOrder.deliveryAddress,
      status: value.status ?? existingOrder.status,
      totalPrice,
    };
    const updatedOrder = await orderService.update(id, updatedFields);
    if (!updatedOrder) {
      return handleResponse(res, 404, "Commande non trouvée");
    }
    updatedOrder.populate({ path: "products.productId", select: "label" });
    // Récupération des informations utilisateur pour les mails
    const user = await userService.getUserById(updatedOrder.userId);
    if (!user) {
      return handleResponse(
        res,
        404,
        "Utilisateur non trouvé pour cette commande",
      );
    }
    // Si le statut est passé à "Accepté", envoyer un mail de confirmation
    if (updatedFields.status === "Accepté") {
      await mailService.confirmedOrder(updatedOrder, user);
    }
    // Si le statut est passé à "Refusée", envoyer un mail de refus
    if (updatedFields.status === "Refusée") {
      await mailService.refusedOrder(updatedOrder, user);
    }
    return handleResponse(
      res,
      200,
      "Commande mise à jour avec succès",
      updatedOrder,
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
