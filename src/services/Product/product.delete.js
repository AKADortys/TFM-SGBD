const Product = require("../../models/Product");
const { handleServiceError } = require("../../utils/service.util");

// Supprimer un produit
module.exports = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return null;
    return true;
  } catch (error) {
    handleServiceError(error, "Erreur lors de la suppression du produit", {
      service: "productService",
      operation: "deleteProduct",
    });
  }
};
