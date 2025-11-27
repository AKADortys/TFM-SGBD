const Order = require("../../models/Order");
const { handleServiceError } = require("../../utils/service.util");

// Créer une nouvelle commande
module.exports = async (order) => {
  try {
    const newOrder = new Order(order);
    await newOrder.save();

    return await newOrder.populate({
      path: "products.productId",
      select: "label",
    });
  } catch (error) {
    handleServiceError(error, "Erreur lors de la création de la commande", {
      service: "orderService",
      operation: "createOrder",
    });
  }
};
