const Order = require("../../models/Order");
const {
  handleServiceError,
  paginatedQuery,
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
      [
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
    handleServiceError(error, "Erreur lors de la récupération des commandes", {
      service: "orderService",
      operation: "getAllOrders",
    });
  }
};

//builder des filtres des commandes
const buildOrderFilter = (query) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.productId) filter["products.productId"] = query.productId;

  if (query.minQty) {
    filter["products.quantity"] = { $gte: Number(query.minQty) };
  }

  if (query.minPrice || query.maxPrice) {
    filter.totalPrice = {};
    if (query.minPrice) filter.totalPrice.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.totalPrice.$lte = Number(query.maxPrice);
  }

  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }

  if (query.address) {
    filter.deliveryAddress = { $regex: query.address, $options: "i" };
  }

  return filter;
};
