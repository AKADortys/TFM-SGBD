const Order = require("../../models/Order");
const { handleServiceError } = require("../../utils/service.util");

// Supprimer une commande
module.exports = async (id) => {
  try {
    await Order.findByIdAndDelete(id);
    return true;
  } catch (error) {
    handleServiceError(error, "Erreur lors de la suppresion de la commande", {
      service: "orderService",
      operation: "deleteOrder",
    });
  }
};
