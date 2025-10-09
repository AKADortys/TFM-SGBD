const orderService = require("../services/orders.service");
const mailService = require("../services/mail.service");
const productService = require("../services/product.service");
const { createOrderSchema, updateOrderSchema } = require("../dto/order.dto");
const { isObjectId, handleResponse } = require("../utils/controller.util");

module.exports = {
  // Récupération de tous les commandes
  getAllOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const result = await orderService.getAllOrders(page, limit);

      return handleResponse(res, 200, result);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      return handleResponse(res, 500, {
        message: "Erreur serveur",
        error: error.message,
      });
    }
  },
  // Récupération d'une commande par son ID
  getOrderById: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, { message: "ID manquant" });
      const idError = isObjectId(id);
      if (idError) return handleResponse(res, 400, { message: idError });

      const order = await orderService.getOrderById(id);
      if (!order)
        return handleResponse(res, 404, { message: "Commande non trouvée" });
      return handleResponse(res, 200, order);
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande:", error);
      return handleResponse(res, 500, { message: "Erreur Server" });
    }
  },
  // Récupération d'une commande par son userId
  getUserOrders: async (req, res) => {
    try {
      const skip = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, { message: "ID manquant" });

      const idError = isObjectId(id);
      if (idError) return handleResponse(res, 400, { message: idError });

      const result = await orderService.getOrdersByUserId(id, skip, limit);
      return handleResponse(res, 200, result);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des commandes par userId:",
        error
      );
      return handleResponse(res, 500, { message: "Erreur Server" });
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
      return handleResponse(res, 400, { message: "Statut invalide" });
    }
    try {
      const result = await orderService.getOrdersByStatus(status, skip, limit);
      return handleResponse(res, 200, result);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des commandes par statut:",
        error
      );
      return handleResponse(res, 500, { message: "Erreur Server" });
    }
  },
  // Suppression d'une commande
  deleteOrder: async (req, res) => {
    try {
      const id = req.params.id;
      const idError = isObjectId(id);
      if (idError) return handleResponse(res, 400, { message: idError });
      const order = await orderService.getOrderById(id);
      if (!order) {
        return handleResponse(res, 404, { message: "Commande introuvable" });
      }
      await orderService.deleteOrder(id);
      return handleResponse(res, 200, {
        message: "Commande supprimée avec succès",
      });
    } catch (error) {
      console.error("erreur lors de la suppresion", error);
      return handleResponse(res, 500, { message: "Erreur server" });
    }
  },
  // Création d'une commande
  createOrder: async (req, res) => {
    try {
      const { error, value } = createOrderSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return handleResponse(res, 400, { message: error.details[0].message });
      }

      const { userId, products, deliveryAddress, status } = value;
      for (const element of products) {
        const exist = await productService.getProductById(element.productId);
        if (!exist)
          return handleResponse(res, 400, { message: "Produit inexistant" });
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
      return handleResponse(res, 201, order);
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      return handleResponse(res, 500, { message: "Erreur Server" });
    }
  },
  // Modification d'une commande
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const idError = isObjectId(id);
      if (idError) return handleResponse(res, 400, { message: idError });
      const existingOrder = await orderService.getOrderById(id);
      if (!existingOrder) {
        return handleResponse(res, 404, { message: "Commande non trouvée" });
      }
      const modifiableStatuses = ["En attente", "En cours de traitement"];
      if (!modifiableStatuses.includes(existingOrder.status)) {
        return handleResponse(res, 400, {
          message: `La commande ne peut pas être modifiée car son statut est "${existingOrder.status}"`,
        });
      }

      const { error, value } = updateOrderSchema.validate(req.body);
      if (error) {
        return handleResponse(res, 400, { message: error.details[0].message });
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
      return handleResponse(res, 200, updatedOrder);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande:", error);
      return handleResponse(res, 500, { message: "Erreur Server" });
    }
  },
  // Récupération des commandes avec détails (produits)
  getOrdersWithDetails: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id || isObjectId(id)) {
        return handleResponse(res, 400, { message: "ID invalide" });
      }
      const orders = await orderService.getOrderWithDetails(id);
      if (orders === null)
        return handleResponse(res, 404, { message: "Aucunes commande" });
      return handleResponse(res, 200, orders);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      return handleResponse(res, 500, { message: "Erreur Server" });
    }
  },
};
