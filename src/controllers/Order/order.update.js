const orderService = require("../../services/orders.index");
const productService = require("../../services/product.index");
const { updateOrderSchema } = require("../../dto/order.dto");
const { isObjectId, handleResponse } = require("../../utils/controller.util");

// Modification d'une commande
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const idError = isObjectId(id);
    if (idError) return handleResponse(res, 400, idError);
    const existingOrder = await orderService.getById(id);
    if (!existingOrder) {
      return handleResponse(res, 404, "Commande non trouvée");
    }
    if (
      req.user.id !== existingOrder.userId?.toString() &&
      req.user.role !== "admin"
    ) {
      return handleResponse(res, 403, "Accès refusé");
    }
    const modifiableStatuses = ["En attente", "Confirmée"];
    if (!modifiableStatuses.includes(existingOrder.status)) {
      return handleResponse(
        res,
        400,
        `La commande ne peut pas être modifiée car son statut est "${existingOrder.status}"`,
      );
    }
    const { error, value } = updateOrderSchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }
    let { totalPrice } = existingOrder;
    if (value.products) {
      const docs = await Promise.all(
        value.products.map((p) => productService.getById(p.productId)),
      );
      if (docs.some((d) => !d)) {
        return handleResponse(res, 400, "Produit inexistant");
      }
      const normalized = value.products.map((p, i) => ({
        productId: p.productId,
        quantity: p.quantity,
        price: docs[i].price,
      }));
      value.products = normalized;
      totalPrice = normalized.reduce((sum, p) => sum + p.price * p.quantity, 0);
    }
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
