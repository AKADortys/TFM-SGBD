const Order = require("../../models/Order");
const { handleServiceError } = require("../../utils/service.util");

// Mettre à jour une commande existante
module.exports = async (id, updatedOrder, io) => {
  try {
    const order = await Order.findByIdAndUpdate(id, updatedOrder, {
      new: true,
    });
    if (!order) return null;

    if (io) {
      io.to(`user_${order.userId}`).emit('order_status_updated', { orderId: order._id, status: order.status });
    }

    return order;
  } catch (error) {
    handleServiceError(error, "Erreur lors de la mise à jour de la commandes", {
      service: "orderService",
      operation: "updateOrder",
    });
  }
};
