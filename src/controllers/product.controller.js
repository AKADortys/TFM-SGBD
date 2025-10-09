const productService = require("../services/product.service");
const { ObjectId } = require("mongodb");
const { productSchema, updateProductSchema } = require("../dto/product.dto");

module.exports = {
  // Récupération de tous les produits
  getProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const products = await productService.getAllProducts(page, limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Erreur Server" });
    }
  },
  // Récupération d'un produit par ID
  getProductById: async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Erreur Server" });
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
        return res.status(400).json({ errors });
      }

      const newProduct = await productService.createProduct(value);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error.message.includes("E11000"))
        return res
          .status(500)
          .json({ message: "Le nom du produit existe déjà !" });
      res.status(400).json({ message: "Erreur Server" });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }

      const { error, value } = updateProductSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(400).json({ errors });
      }

      const updatedProduct = await productService.updateProduct(id, value);

      if (!updatedProduct) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      res.status(201).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: "Erreur Server" });
    }
  },
  // Suppression d'un produit par ID
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      await productService.deleteProduct(id);
      res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur Server" });
    }
  },
};
