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
  // Création d'un nouveau produit
  createProduct: async (req, res) => {
    try {
      const { label, description, price, category } = req.body;
      // Validation des champs requis
      if (!label || !description || !price || !category) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }
      // Validation du libellé (minimum 2 caractères)
      if (!validator.isLength(label, { min: 2 })) {
        return res
          .status(400)
          .json({ message: "Le libellé doit contenir au moins 2 caractères" });
      }
      // Validation de la description (minimum 10 caractères)
      if (!validator.isLength(description, { min: 10 })) {
        return res.status(400).json({
          message: "La description doit contenir au moins 10 caractères",
        });
      }
      // Validation du prix (minimum 0)
      if (price < 0) {
        return res
          .status(400)
          .json({ message: "Le prix doit être supérieur ou égal à 0" });
      }
      // Validation de la catégorie (minimum 1 caractère)
      if (!validator.isLength(category, { min: 1 })) {
        return res
          .status(400)
          .json({ message: "La catégorie doit contenir au moins 1 caractère" });
      }
      const newProduct = await productService.createProduct({
        label,
        description,
        price,
        category,
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // Modification d'un produit par ID
  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const { label, description, price, category } = req.body;
      // Validation des champs modifiables
      let updatedFields = {};
      if (label) {
        if (!validator.isLength(label, { min: 2 })) {
          return res.status(400).json({
            message: "Le libellé doit contenir au moins 2 caractères",
          });
        }
        updatedFields.label = label;
      }
      if (description) {
        if (!validator.isLength(description, { min: 10 })) {
          return res.status(400).json({
            message: "La description doit contenir au moins 10 caractères",
          });
        }
        updatedFields.description = description;
      }
      if (price >= 0) {
        updatedFields.price = price;
      }
      if (category) {
        if (!validator.isLength(category, { min: 1 })) {
          return res.status(400).json({
            message: "La catégorie doit contenir au moins 1 caractère",
          });
        }
        updatedFields.category = category;
      }
      if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: "Aucun champ modifié" });
      }
      const updatedProduct = await productService.updateProduct(
        id,
        updatedFields
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      res.status(201).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // Suppression d'un produit par ID
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      await productService.deleteProduct(id);
      res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
