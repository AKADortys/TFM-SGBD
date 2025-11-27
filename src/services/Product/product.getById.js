const Product = require("../../models/Product");
const { handleServiceError } = require("../../utils/service.util");

// Récupérer un produit par ID
module.exports = async (id) => {
  try {
    const product = await Product.findById(id);
    return product || null;
  } catch (error) {
    handleServiceError(error, "Erreur lors de la récupération du produit", {
      service: "productService",
      operation: "getProductById",
    });
  }
};
