const Order = require("../models/Order");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const {
  handleServiceError,
  paginatedQuery,
  decrypt,
} = require("../utils/service.util");
module.exports = {
  // Récupérer toutes les commandes avec pagination
  getAllOrders: async (askPage, limit) => {
    try {
      const { items, total, totalPages, page } = await paginatedQuery(
        Order,
        {},
        askPage,
        limit,
        { createdAt: -1 },
        { path: "products.productId", select: "label" }
      );
      return {
        orders: items,
        total,
        totalPages,
        page,
      };
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération des commandes",
        {
          service: "orderService",
          operation: "getAllOrders",
        }
      );
    }
  },
  // Récupérer une commande par ID
  getOrderById: async (id) => {
    try {
      const order = await Order.findById(id);
      if (!order) return null;
      return order.populate({ path: "products.productId", select: "label" });
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération de la commande",
        {
          service: "orderService",
          operation: "getOrderById",
        }
      );
    }
  },
  // Créer une nouvelle commande
  createOrder: async (order) => {
    try {
      const newOrder = new Order(order);
      await newOrder.save();

      const populatedOrder = await newOrder.populate({
        path: "products.productId",
        select: "label",
      });
      return populatedOrder;
    } catch (error) {
      handleServiceError(error, "Erreur lors de la création de la commande", {
        service: "orderService",
        operation: "createOrder",
      });
    }
  },
  // Mettre à jour une commande existante
  updateOrder: async (id, updatedOrder) => {
    try {
      const order = await Order.findByIdAndUpdate(id, updatedOrder, {
        new: true,
      });
      if (!order) return null;
      return order;
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la mise à jour de la commandes",
        { service: "orderService", operation: "updateOrder" }
      );
    }
  },
  // Supprimer une commande
  deleteOrder: async (id) => {
    try {
      await Order.findByIdAndDelete(id);
      return true;
    } catch (error) {
      handleServiceError(error, "Erreur lors de la suppresion de la commande", {
        service: "orderService",
        operation: "deleteOrder",
      });
    }
  },
  // Récupérer les commandes d'un utilisateur par ID
  getOrdersByUserId: async (userId, askPage, limit) => {
    try {
      const { items, page, totalPages, total } = await paginatedQuery(
        Order,
        { userId: new mongoose.Types.ObjectId(userId) },
        askPage,
        limit,
        { createdAt: -1 },
        { path: "products.productId", select: "label" }
      );
      return {
        orders: items,
        total,
        totalPages,
        page,
      };
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération des commandes utilisateur",
        {
          service: "orderService",
          operation: "getOrdersByUserId",
        }
      );
    }
  },
  // Récupérer les commandes par statut
  getOrdersByStatus: async (status, askPage, limit) => {
    try {
      const { items, page, total, totalPages } = await paginatedQuery(
        Order,
        { status },
        askPage,
        limit,
        { createdAt: -1 },
        { path: "products.productId", select: "label" }
      );
      return {
        orders: items,
        total,
        totalPages,
        page,
      };
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération des commandes par statut",
        { service: "orderService", operation: "getOrdersByStatus" }
      );
    }
  },
  // Récupérer le détail d'une commande avec les informations utilisateur et produit
  getOrderWithDetails: async (orderId) => {
    try {
      const orders = await Order.aggregate([
        {
          $match: {
            _id: orderId instanceof ObjectId ? orderId : new ObjectId(orderId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $group: {
            _id: "$_id",
            user: { $first: "$user" },
            deliveryAddress: { $first: "$deliveryAddress" },
            status: { $first: "$status" },
            totalPrice: { $first: "$totalPrice" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            products: {
              $push: {
                quantity: "$products.quantity",
                productDetails: "$productDetails",
              },
            },
          },
        },
        {
          $project: {
            user: { name: 1, lastName: 1, mail: 1, phone: 1 },
            deliveryAddress: 1,
            status: 1,
            totalPrice: 1,
            createdAt: 1,
            updatedAt: 1,
            products: 1,
          },
        },
      ]);
      if (orders[0]) orders[0].user.phone = decrypt(orders[0].user.phone);
      return orders[0] || null;
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération du détail de la commande",
        { service: "orderService", operation: "getOrderWithDetails" }
      );
    }
  },
  // Annuler une commande
  cancelOrder: async (id) => {
    try {
      await Order.findByIdAndUpdate(id, { status: "Annulée" });
      return true;
    } catch (error) {
      handleServiceError(error, "Erreur lors de l'annulation de la commande", {
        service: "orderService",
        operation: "cancelOrder",
      });
    }
  },
};
