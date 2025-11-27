const Order = require("../../models/Order");
const { handleServiceError } = require("../../utils/service.util");

// Mettre à jour une commande existante
module.exports = async (id, updatedOrder) => {
  try {
    const order = await Order.findByIdAndUpdate(id, updatedOrder, {
      new: true,
    });
    if (!order) return null;
    return order;
  } catch (error) {
    handleServiceError(error, "Erreur lors de la mise à jour de la commandes", {
      service: "orderService",
      operation: "updateOrder",
    });
  }
};
