const productService = require("../services/product.service");
const validator = require("validator");
const { ObjectId } = require("mongodb");

module.exports = {
  // Récupération de tous les produits
  getProducts: async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
    }
  },
};
