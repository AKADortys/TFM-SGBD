const Order = require("../models/Order");
const mongoose = require("mongoose");

module.exports = {
  getAllOrders: async () => {
    try {
      const orders = await Order.find();
      return orders;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getOrderById: async (id) => {
    try {
      const order = await Order.findById(id);
      if (!order) throw new Error("Commande introuvable");
      return order;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  createOrder: async (order) => {
    try {
      const newOrder = new Order(order);
      await newOrder.save();
      return newOrder;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateOrder: async (id, updatedOrder) => {
    try {
      const order = await Order.findByIdAndUpdate(id, updatedOrder, {
        new: true,
      });
      if (!order) throw new Error("Commande introuvable");
      return order;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteOrder: async (id) => {
    try {
      await Order.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getOrdersByUserId: async (userId) => {
    try {
      const orders = await Order.find({
        userId: new mongoose.Types.ObjectId(userId),
      });
      return orders;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getOrdersByStatus: async (status) => {
    try {
      const orders = await Order.find({ status });
      return orders;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getOrdersWithDetails: async () => {
    try {
      const orders = await Order.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" }, // Assure que l'utilisateur est un objet unique

        // Décompose le tableau "products" en plusieurs documents
        { $unwind: "$products" },

        // Joint les détails du produit associé à chaque produit commandé
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" }, // Assure que chaque produit est un objet unique

        // Regrouper les produits de la commande pour recréer le tableau "products"
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

        // Sélection des champs utiles
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

      return orders;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
