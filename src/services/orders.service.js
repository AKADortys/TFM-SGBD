const Order = require("../models/Order");

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
      const orders = await Order.find({ userId });
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

  getOrdersByTotalPriceRange: async (min, max) => {
    try {
      const orders = await Order.find({ totalPrice: { $gte: min, $lte: max } });
      return orders;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getOrdersByCreatedAtRange: async (start, end) => {
    try {
      const orders = await Order.find({
        createdAt: { $gte: start, $lte: end },
      });
      return orders;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
