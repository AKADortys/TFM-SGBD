const Product = require("../../models/Product");
const {
  handleServiceError,
  paginatedQuery,
} = require("../../utils/service.util");

// Récupérer tous les produits avec pagination et recherche
module.exports = async (askPage, limit, queryFilter) => {
  try {
    const filter = buildProductFilter(queryFilter);
    console.log(filter);
    const { items, total, totalPages, page } = await paginatedQuery(
      Product,
      filter,
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

//builder des filtres
const buildProductFilter = (query) => {
  const filter = {};

  // Recherche textuelle (label + description)
  if (query.search) {
    filter.$or = [
      { label: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  // Catégorie
  if (query.category) {
    filter.category = query.category;
  }

  // Disponibilité
  if (query.available) {
    filter.available = query.available === true;
  }

  // Fourchette de prix
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  // Filtre exact sur label (optionnel)
  if (query.label) {
    filter.label = query.label;
  }

  // Filtre par date de création
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }

  return filter;
};
