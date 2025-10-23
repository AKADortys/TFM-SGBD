const Product = require("../models/Product");
const { handleServiceError, paginatedQuery } = require("../utils/service.util");

module.exports = {
  // Récupérer tous les produits avec pagination et recherche
  getAllProducts: async (askPage, limit, search) => {
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
  },
  // Récupérer un produit par ID
  getProductById: async (id) => {
    try {
      const product = await Product.findById(id);
      return product || null;
    } catch (error) {
      handleServiceError(error, "Erreur lors de la récupération du produit", {
        service: "productService",
        operation: "getProductById",
      });
    }
  },
  // Créer un nouveau produit
  createProduct: async (productData) => {
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
  },
  // Mettre à jour un produit existant
  updateProduct: async (id, updateData) => {
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
  },
  // Supprimer un produit
  deleteProduct: async (id) => {
    try {
      await Product.findByIdAndDelete(id);
      return true;
    } catch (error) {
      handleServiceError(error, "Erreur lors de la suppression du produit", {
        service: "productService",
        operation: "deleteProduct",
      });
    }
  },
};
