const Order = require("../../models/Order");
const { handleServiceError } = require("../../utils/service.util");

// Supprimer une commande
module.exports = async (id) => {
  try {
    const deleted = await Order.findByIdAndDelete(id);
    return deleted !== null;
  } catch (error) {
    handleServiceError(error, "Erreur lors de la suppresion de la commande", {
      service: "orderService",
      operation: "deleteOrder",
    });
  }
};
