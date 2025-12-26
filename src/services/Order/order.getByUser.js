const Order = require("../../models/Order");
const mongoose = require("mongoose");
const {
  handleServiceError,
  paginatedQuery,
} = require("../../utils/service.util");

// Récupérer les commandes d'un utilisateur par ID
module.exports = async (userId, askPage, limit) => {
  try {
    const { items, page, totalPages, total } = await paginatedQuery(
      Order,
      { userId: new mongoose.Types.ObjectId(userId), status: "Complétée" },
      askPage,
      limit,
      { createdAt: -1 },
      [
        { path: "products.productId", select: "label" },
        { path: "userId", select: "mail" },
      ]
    );
    return {
      orders: items,
      total,
      totalPages,
      page,
    };
  } catch (error) {
    handleServiceError(
      error,
      "Erreur lors de la récupération des commandes utilisateur",
      {
        service: "orderService",
        operation: "getOrdersByUserId",
      }
    );
  }
};
