const Product = require("../../models/Product");
const { handleServiceError } = require("../../utils/service.util");

// Créer un nouveau produit
module.exports = async (productData) => {
  try {
    const product = new Product(productData);
    await product.save();
    return product;
  } catch (error) {
    handleServiceError(error, error.message, {
      service: "productService",
      operation: "createProduct",
    });
  }
};
