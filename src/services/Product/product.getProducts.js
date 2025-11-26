const Product = require("../../models/Product");
const {
  handleServiceError,
  paginatedQuery,
} = require("../../utils/service.util");

// Récupérer tous les produits avec pagination et recherche
module.exports = async (askPage, limit, search) => {
  try {
    const { items, total, totalPages, page } = await paginatedQuery(
      Product,
      {
        $or: [
          { label: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
      askPage,
      limit
    );
    return { products: items, total, totalPages, page };
  } catch (error) {
    handleServiceError(error, "Erreur lors de la récupération des produits", {
      service: "productService",
      operation: "getAllProducts",
    });
  }
};
