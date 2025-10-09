const productService = require("../services/product.service");
const { productSchema, updateProductSchema } = require("../dto/product.dto");
const { handleResponse, isObjectId } = require("../utils/controller.util");

module.exports = {
  // Récupération de tous les produits
  getProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const products = await productService.getAllProducts(page, limit);
      return handleResponse(res, 200, products);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      return handleResponse(res, 500, { message: "Erreur Server" });
    }
  },
  // Récupération d'un produit par ID
  getProductById: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, { message: "ID manquant" });
      if (isObjectId(id)) {
        return handleResponse(res, 400, { message: "ID invalide" });
      }
      const product = await productService.getProductById(id);
      if (!product) {
        return handleResponse(res, 404, { message: "Produit non trouvé" });
      }
      return handleResponse(res, 200, product);
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      return handleResponse(res, 500, { message: "Erreur Server" });
    }
  },
  // Création d'un nouveau produit
  createProduct: async (req, res) => {
    try {
      const { error, value } = productSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((d) => d.message);
        return handleResponse(res, 400, { errors });
      }

      const newProduct = await productService.createProduct(value);
      return handleResponse(res, 201, newProduct);
    } catch (error) {
      if (error.message.includes("E11000"))
        return handleResponse(res, 500, {
          message: "Le nom du produit existe déjà !",
        });
      console.error("Erreur lors de la création du produit:", error);
      return handleResponse(res, 400, { message: "Erreur Server" });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, { message: "ID manquant" });
      if (isObjectId(id)) {
        return handleResponse(res, 400, { message: "ID invalide" });
      }

      const { error, value } = updateProductSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((d) => d.message);
        return handleResponse(res, 400, { errors });
      }

      const updatedProduct = await productService.updateProduct(id, value);

      if (!updatedProduct) {
        return handleResponse(res, 404, { message: "Produit non trouvé" });
      }
      return handleResponse(res, 201, updatedProduct);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      return handleResponse(res, 400, { message: "Erreur Server" });
    }
  },
  // Suppression d'un produit par ID
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, { message: "ID manquant" });
      if (isObjectId(id)) {
        return handleResponse(res, 400, { message: "ID invalide" });
      }
      const product = await productService.getProductById(id);
      if (!product) {
        return handleResponse(res, 404, { message: "Produit non trouvé" });
      }
      await productService.deleteProduct(id);
      return handleResponse(res, 200, {
        message: "Produit supprimé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      return handleResponse(res, 500, { message: "Erreur Server" });
    }
  },
};
