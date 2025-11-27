const Order = require("../../models/Order");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { handleServiceError, decrypt } = require("../../utils/service.util");

// Récupérer le détail d'une commande avec les informations utilisateur et produit
module.exports = async (orderId) => {
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
};
