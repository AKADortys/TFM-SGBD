const Order = require("../../models/Order");
const { handleServiceError } = require("../../utils/service.util");
// Récupérer une commande par ID
module.exports = async (id) => {
  try {
    const order = await Order.findById(id);
    if (!order) return null;
    return order.populate({ path: "products.productId", select: "label" });
  } catch (error) {
    handleServiceError(error, "Erreur lors de la récupération de la commande", {
      service: "orderService",
      operation: "getOrderById",
    });
  }
};
