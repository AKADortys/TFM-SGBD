const Product = require("../../models/Product");
const { handleServiceError } = require("../../utils/service.util");

// Mettre à jour un produit existant
module.exports = async (id, updateData) => {
  try {
    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return product || null;
  } catch (error) {
    handleServiceError(error, "Erreur lors de la mise à jour du produit", {
      service: "productService",
      operation: "updateProduct",
    });
  }
};
