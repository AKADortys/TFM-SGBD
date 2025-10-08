const orderService = require("../services/orders.service");
const mailService = require("../services/mail.service");
const productService = require("../services/product.service");
const { createOrderSchema, updateOrderSchema } = require("../dto/order.dto");
const utils = require("../utils/services.util");

module.exports = {
  // Récupération de tous les commandes
  getAllOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const result = await orderService.getAllOrders(page, limit);

      return res.status(200).json({
        data: result.orders,
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
  // Récupération d'une commande par son ID
  getOrderById: async (req, res) => {
    try {
      const id = req.params.id;
      const idError = utils.isObjectId(id);
      if (idError) return res.status(400).json({ message: idError });

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
      const skip = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const id = req.params.id;

      const idError = utils.isObjectId(id);
      if (idError) return res.status(400).json({ message: idError });

      const result = await orderService.getOrdersByUserId(id, skip, limit);
      return res.status(200).json({
        data: result.orders,
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur Server" });
    }
  },
  // Récuperation commande par status
  getOrdersByStatus: async (req, res) => {
    const skip = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const validStatus = [
      "En attente",
      "En cours de traitement",
      "Confirmée",
      "Prêt en magasin",
      "Refusée",
      "Annulée",
    ];
    const status = req.params.status;
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }
    try {
      const result = await orderService.getOrdersByStatus(status, skip, limit);
      return res.status(200).json({
        data: result.orders,
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur Server" });
    }
  },
  // Suppression d'une commande
  deleteOrder: async (req, res) => {
    try {
      const id = req.params.id;
      const idError = utils.isObjectId(id);
      if (idError) return res.status(400).json({ message: idError });
      const order = await orderService.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Commande introuvable" });
      }
      await orderService.deleteOrder(id);
      res.json({ message: "Commande supprimée avec succès" });
    } catch (error) {
      console.error("erreur lors de la suppresion", error);
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

      const { userId, products, deliveryAddress, status } = value;
      for (const element of products) {
        const exist = await productService.getProductById(element.productId);
        if (!exist) {
          return res
            .status(400)
            .json({ message: "Un produit dans la commande n'existe pas" });
        }
      }

      let totalPrice = products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
      const newOrder = {
        userId,
        products,
        deliveryAddress,
        totalPrice,
        status,
      };
      const order = await orderService.createOrder(newOrder);
      await mailService.newOrder(order, req.user);
      return res.status(201).json(order);
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
      const idError = utils.isObjectId(id);
      if (idError) return res.status(400).json({ message: idError });
      const existingOrder = await orderService.getOrderById(id);
      if (!existingOrder) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }
      const modifiableStatuses = ["En attente", "En cours de traitement"];
      if (!modifiableStatuses.includes(existingOrder.status)) {
        return res
          .status(403)
          .json({ message: "Modification interdite pour cette commande" });
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
        status: value.status || existingOrder.status,
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
      const id = req.params.id;
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const orders = await orderService.getOrderWithDetails(id);
      if (orders === null)
        res.status(404).json({ message: "Aucunes commande" });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Erreur Server" });
    }
  },
};
