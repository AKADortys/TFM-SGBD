const productService = require("../services/product.service");
const { productSchema, updateProductSchema } = require("../dto/product.dto");
const { handleResponse, isObjectId } = require("../utils/controller.util");

module.exports = {
  // Récupération de tous les produits
  getProducts: async (req, res) => {
    try {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const products = await productService.getAllProducts(page, limit, search);
      return handleResponse(
        res,
        200,
        "Produits récupérés avec succès",
        products
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      return handleResponse(res, 500, "Erreur Server");
    }
  },
  // Récupération d'un produit par ID
  getProductById: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, "ID manquant");
      if (isObjectId(id)) {
        return handleResponse(res, 400, "ID invalide");
      }
      const product = await productService.getProductById(id);
      if (!product) {
        return handleResponse(res, 404, "Produit non trouvé");
      }
      return handleResponse(res, 200, "Produit récupéré avec succès", product);
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      return handleResponse(res, 500, "Erreur Server");
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
        return handleResponse(res, 400, errors);
      }

      const newProduct = await productService.createProduct(value);
      return handleResponse(res, 201, "Produit créé avec succès", newProduct);
    } catch (error) {
      if (error.message.includes("E11000"))
        return handleResponse(res, 400, "Le nom du produit existe déjà !");
      console.error("Erreur lors de la création du produit:", error);
      return handleResponse(res, 500, "Erreur Server");
    }
  },
  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, "ID manquant");
      if (isObjectId(id)) {
        return handleResponse(res, 400, "ID invalide");
      }

      const { error, value } = updateProductSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((d) => d.message);
        return handleResponse(res, 400, errors);
      }

      const updatedProduct = await productService.updateProduct(id, value);

      if (!updatedProduct) {
        return handleResponse(res, 404, "Produit non trouvé");
      }
      return handleResponse(
        res,
        201,
        "Produit mis à jour avec succès",
        updatedProduct
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      return handleResponse(res, 500, "Erreur Server");
    }
  },
  // Suppression d'un produit par ID
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, "ID manquant");
      if (isObjectId(id)) {
        return handleResponse(res, 400, "ID invalide");
      }
      const product = await productService.getProductById(id);
      if (!product) {
        return handleResponse(res, 404, "Produit non trouvé");
      }
      await productService.deleteProduct(id);
      return handleResponse(res, 200, "Produit supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      return handleResponse(res, 500, "Erreur Server");
    }
  },
};
