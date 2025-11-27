const Order = require("../../models/Order");
const {
  handleServiceError,
  paginatedQuery,
  buildOrderFilter,
} = require("../../utils/service.util");

// Récupérer toutes les commandes avec pagination
module.exports = async (askPage, limit, queryFilters) => {
  try {
    const filter = buildOrderFilter(queryFilters);
    const { items, total, totalPages, page } = await paginatedQuery(
      Order,
      filter,
      askPage,
      limit,
      { createdAt: -1 },
      [{ path: "products.productId", select: "label price" }]
    );
    return {
      orders: items,
      total,
      totalPages,
      page,
    };
  } catch (error) {
    handleServiceError(error, "Erreur lors de la récupération des commandes", {
      service: "orderService",
      operation: "getAllOrders",
    });
  }
};
