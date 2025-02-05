const orderService = require("../services/orders.service");
const validator = require("validator");
const { ObjectId } = require("mongodb");

module.exports = {
  // Récupération de tous les commandes
  getAllOrders: async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Récupération d'une commande par son ID
  getOrderById: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const order = await orderService.getOrderById(id);
      if (!order)
        return res.status(404).json({ message: "Commande non trouvée" });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Création d'une commande
  createOrder: async (req, res) => {
    try {
      const { userId, products, deliveryAddress } = req.body;

      // Vérification des champs requis
      if (!userId || !products || !deliveryAddress) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      // Vérification de l'ID utilisateur
      if (!ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ message: "ID de l'utilisateur invalide" });
      }

      // Vérification du tableau des produits
      if (!Array.isArray(products) || products.length === 0) {
        return res
          .status(400)
          .json({ message: "Le tableau des produits est vide ou invalide" });
      }
      let totalPrice = 0;
      // Vérification des produits
      for (const product of products) {
        if (
          !product.productId ||
          !ObjectId.isValid(product.productId) ||
          typeof product.quantity !== "number" ||
          product.quantity <= 0 ||
          typeof product.price !== "number"
        ) {
          return res.status(400).json({
            message:
              "Chaque produit doit avoir un ID valide, une quantité positive et un prix numérique.",
          });
        }
        totalPrice += product.price * product.quantity;
      }

      // Vérification de l'adresse de livraison
      if (!validator.isLength(deliveryAddress, { min: 10 })) {
        return res.status(400).json({
          message:
            "L'adresse de livraison doit contenir au moins 10 caractères",
        });
      }

      // Création de la commande
      const newOrder = { userId, products, deliveryAddress, totalPrice };
      const order = await orderService.createOrder(newOrder);
      res.status(201).json(order);
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      res.status(500).json({
        message: "Une erreur est survenue, veuillez réessayer plus tard.",
      });
    }
  },
  // Suppression d'une commande
  deleteOrder: async (req, res) => {
    try {
      await orderService.deleteOrder(req.params.id);
      res.json({ message: "Commande supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Modification d'une commande
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, products, deliveryAddress } = req.body;
      let updatedFields = {};

      // Vérification de l'ID de la commande
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de la commande invalide" });
      }

      // Récupération de la commande existante
      const existingOrder = await orderService.getOrderById(id);
      if (!existingOrder) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }

      // Vérification optionnelle de l'ID utilisateur si fourni
      if (userId && !ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ message: "ID de l'utilisateur invalide" });
      }

      let totalPrice = 0;
      // Vérification du tableau des produits s'il est fourni
      if (products) {
        if (!Array.isArray(products) || products.length === 0) {
          return res
            .status(400)
            .json({ message: "Le tableau des produits est vide ou invalide" });
        }
        for (const product of products) {
          if (
            !product.productId ||
            !ObjectId.isValid(product.productId) ||
            typeof product.quantity !== "number" ||
            product.quantity <= 0 ||
            typeof product.price !== "number"
          ) {
            return res.status(400).json({
              message:
                "Chaque produit doit avoir un ID valide, une quantité positive et un prix numérique.",
            });
          }
          totalPrice += product.price * product.quantity;
        }
      }

      // Vérification de l'adresse de livraison si fournie
      if (
        deliveryAddress &&
        !validator.isLength(deliveryAddress, { min: 10 })
      ) {
        return res.status(400).json({
          message:
            "L'adresse de livraison doit contenir au moins 10 caractères",
        });
      }
      updatedFields = {
        userId: userId || existingOrder.userId,
        products: products || existingOrder.products,
        deliveryAddress: deliveryAddress || existingOrder.deliveryAddress,
        totalPrice: totalPrice || existingOrder.totalPrice,
      };

      // Mise à jour de la commande
      const updatedOrder = await orderService.updateOrder(id, req.body);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande:", error);
      res.status(500).json({
        message: "Une erreur est survenue, veuillez réessayer plus tard.",
      });
    }
  },
  // Récupération des commandes d'un utilisateur
  getUserOrders: async (req, res) => {
    try {
      const orders = await orderService.getOrdersByUserId(req.params.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Récupération des commandes d'un état donné
  getOrdersByState: async (req, res) => {
    try {
      const orders = await orderService.getOrdersByState(req.params.state);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Récupération des commandes ayant une date de livraison entre deux dates
  getOrdersByDate: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const orders = await orderService.getOrdersByDate(startDate, endDate);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
