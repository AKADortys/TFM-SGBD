const orderService = require("../services/orders.service");
const { createOrderSchema, updateOrderSchema } = require("../dto/order.dto");
const { ObjectId } = require("mongodb");

module.exports = {
  // Récupération de tous les commandes
  getAllOrders: async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Erreur Server" });
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
      res.status(500).json({ message: "Erreur Server" });
    }
  },
  // Récupération d'une commande par son userId
  getUserOrders: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }

      const orders = await orderService.getOrdersByUserId(id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Erreur Server" });
    }
  },
  // Suppression d'une commande
  deleteOrder: async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const order = await orderService.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Commande introuvable" });
      }
      await orderService.deleteOrder(id);
      res.json({ message: "Commande supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur server" });
    }
  },
  // Création d'une commande
  createOrder: async (req, res) => {
    try {
      const { error, value } = createOrderSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { userId, products, deliveryAddress } = value;
      let totalPrice = products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );

      const newOrder = { userId, products, deliveryAddress, totalPrice };
      const order = await orderService.createOrder(newOrder);
      res.status(201).json(order);
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      res.status(500).json({
        message: "Erreur Server",
      });
    }
  },
  // Modification d'une commande
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de la commande invalide" });
      }

      const existingOrder = await orderService.getOrderById(id);
      if (!existingOrder) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }

      const { error, value } = updateOrderSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      let totalPrice = existingOrder.totalPrice;
      if (value.products) {
        totalPrice = value.products.reduce(
          (sum, product) => sum + product.price * product.quantity,
          0
        );
      }

      const updatedFields = {
        userId: value.userId || existingOrder.userId,
        products: value.products || existingOrder.products,
        deliveryAddress: value.deliveryAddress || existingOrder.deliveryAddress,
        totalPrice,
      };

      const updatedOrder = await orderService.updateOrder(id, updatedFields);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }
      res.json(updatedOrder);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande:", error);
      res.status(500).json({ message: "Erreur Server" });
    }
  },
  // Récupération des commandes avec détails (produits)
  getOrdersWithDetails: async (req, res) => {
    try {
      const orders = await orderService.getOrdersWithDetails();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Erreur Server" });
    }
  },
};
