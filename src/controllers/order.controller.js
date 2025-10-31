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
      return handleResponse(res, 200, "commandes récupérées", result);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      return handleResponse(res, 500, "Erreur serveur");
    }
  },
  // Récupération d'une commande par son ID
  getOrderById: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, "ID manquant");
      const idError = isObjectId(id);
      if (idError) return handleResponse(res, 400, idError);
      const order = await orderService.getOrderById(id);
      if (!order) return handleResponse(res, 404, "Commande non trouvée");
      if (
        req.user.id !== order.userId.toString() &&
        req.user.role !== "admin"
      ) {
        return handleResponse(res, 403, "Accès refusé");
      }
      return handleResponse(res, 200, "Commande récupérée", order);
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande:", error);
      return handleResponse(res, 500, "Erreur Server");
    }
  },
  // Récupération d'une commande par son userId
  getUserOrders: async (req, res) => {
    try {
      const skip = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, "ID manquant");
      const idError = isObjectId(id);
      if (idError) return handleResponse(res, 400, idError);
      if (req.user.id !== id && req.user.role !== "admin") {
        return handleResponse(res, 403, "Accès refusé");
      }
      const result = await orderService.getOrdersByUserId(id, skip, limit);
      return handleResponse(res, 200, "commandes récupérées", result);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des commandes par userId:",
        error
      );
      return handleResponse(res, 500, "Erreur Server");
    }
  },
  // Récuperation commande par status
  getOrdersByStatus: async (req, res) => {
    const skip = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const validStatus = [
      "En attente",
      "Accepté",
      "Confirmée",
      "Refusée",
      "Annulée",
    ];
    const status = req.params.status;
    if (!validStatus.includes(status)) {
      return handleResponse(res, 400, "Statut invalide");
    }
    try {
      const result = await orderService.getOrdersByStatus(status, skip, limit);
      return handleResponse(res, 200, "commandes récupérées", result);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des commandes par statut:",
        error
      );
      return handleResponse(res, 500, "Erreur Server");
    }
  },
  // annulation d'une commande
  cancelOrder: async (req, res) => {
    try {
      const id = req.params.id;
      const idError = isObjectId(id);
      if (idError) return handleResponse(res, 400, idError);
      const order = await orderService.getOrderById(id);
      if (!order) return handleResponse(res, 404, "Commande non trouvée");
      if (
        req.user.id !== order.userId.toString() &&
        req.user.role !== "admin"
      ) {
        return handleResponse(res, 403, "Accès refusé");
      }
      await orderService.cancelOrder(id);
      return handleResponse(res, 200, "Commande annulée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'annulation de la commande:", error);
      return handleResponse(res, 500, "Erreur Server");
    }
  },
  // Suppression d'une commande
  deleteOrder: async (req, res) => {
    try {
      const id = req.params.id;
      const idError = isObjectId(id);
      if (idError) return handleResponse(res, 400, idError);
      const order = await orderService.getOrderById(id);
      if (!order) {
        return handleResponse(res, 404, "Commande introuvable");
      }
      await orderService.deleteOrder(id);
      return handleResponse(res, 200, "Commande supprimée avec succès");
    } catch (error) {
      console.error("erreur lors de la suppresion", error);
      return handleResponse(res, 500, "Erreur server");
    }
  },
  // Création d'une commande
  createOrder: async (req, res) => {
    try {
      const { error, value } = createOrderSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return handleResponse(res, 400, error.details[0].message);
      }

      let { userId, products, deliveryAddress, status } = value;
      if (!userId) userId = req.user?.id;
      for (const element of products) {
        const exist = await productService.getProductById(element.productId);
        if (!exist)
          return handleResponse(
            res,
            400,
            "Produit inexistant" + element.productId
          );
        element.price = exist.price;
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
      return handleResponse(res, 201, "Commande créée avec succès", order);
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      return handleResponse(res, 500, "Erreur Server");
    }
  },
  // Modification d'une commande
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const idError = isObjectId(id);
      if (idError) return handleResponse(res, 400, idError);
      const existingOrder = await orderService.getOrderById(id);
      if (!existingOrder) {
        return handleResponse(res, 404, "Commande non trouvée");
      }
      if (
        req.user.id !== existingOrder.userId.toString() &&
        req.user.role !== "admin"
      ) {
        return handleResponse(res, 403, "Accès refusé");
      }
      const modifiableStatuses = ["En attente", "Confirmée"];
      if (!modifiableStatuses.includes(existingOrder.status)) {
        return handleResponse(
          res,
          400,
          `La commande ne peut pas être modifiée car son statut est "${existingOrder.status}"`
        );
      }
      const { error, value } = updateOrderSchema.validate(req.body);
      if (error) {
        return handleResponse(res, 400, error.details[0].message);
      }
      let totalPrice = existingOrder.totalPrice;
      if (value.products) {
        const docs = await Promise.all(
          value.products.map((p) => productService.getProductById(p.productId))
        );
        if (docs.some((d) => !d)) {
          return handleResponse(res, 400, "Produit inexistant");
        }
        const normalized = value.products.map((p, i) => ({
          productId: p.productId,
          quantity: p.quantity,
          price: docs[i].price,
        }));
        value.products = normalized;
        totalPrice = normalized.reduce(
          (sum, p) => sum + p.price * p.quantity,
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
        return handleResponse(res, 404, "Commande non trouvée");
      }
      return handleResponse(
        res,
        200,
        "Commande mise à jour avec succès",
        updatedOrder
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande:", error);
      return handleResponse(res, 500, "Erreur Server");
    }
  },
  // Récupération des commandes avec détails (produits)
  getOrdersWithDetails: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id || isObjectId(id)) {
        return handleResponse(res, 400, "ID invalide");
      }
      const orders = await orderService.getOrderWithDetails(id);
      if (orders === null) return handleResponse(res, 404, "Aucunes commande");
      return handleResponse(
        res,
        200,
        "commandes récupérées avec succès",
        orders
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      return handleResponse(res, 500, "Erreur Server");
    }
  },
};
