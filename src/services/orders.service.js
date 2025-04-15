const Order = require("../models/Order");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

module.exports = {
  getAllOrders: async (page = 1, limit = 5) => {
    try {
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        Order.find().skip(skip).limit(limit),
        Order.countDocuments(),
      ]);

      return {
        orders,
        total,
        totalPages: Math.ceil(total / limit),
        page,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getOrderById: async (id) => {
    try {
      const order = await Order.findById(id);
      if (!order) return null;
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
      if (!order) return null;
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

  getOrdersByUserId: async (userId, page, limit) => {
    try {
      const skip = (page - 1) * limit;
      const [orders, total] = await Promise.all([
        Order.find({ userId: new mongoose.Types.ObjectId(userId) })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Order.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
      ]);
      return {
        orders,
        total,
        totalPages: Math.ceil(total / limit),
        page,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getOrdersByStatus: async (statut, page, limit) => {
    try {
      const skip = (page - 1) * limit;
      const [orders, total] = await Promise.all([
        Order.find({ status: statut })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Order.countDocuments({ status: statut }),
      ]);
      return {
        orders,
        total,
        totalPages: Math.ceil(total / limit),
        page,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getOrderWithDetails: async (orderId) => {
    try {
      const orders = await Order.aggregate([
        {
          $match: { _id: new ObjectId(orderId) },
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

      return orders[0] || null;
    } catch (error) {
      console.error(error);

      throw new Error(error.message);
    }
  },
};
