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
              productId: "$products.productId",
              productName: "$products.productName",
              quantity: "$products.quantity",
              price: "$products.price",
            },
          },
        },
      },
      {
        $project: {
          user: {
            name: "$user.name",
            lastName: "$user.lastName",
            mail: "$user.mail",
            phone: "$user.phone",
          },
          deliveryAddress: 1,
          status: 1,
          totalPrice: 1,
          createdAt: 1,
          updatedAt: 1,
          products: 1,
        },
      },
    ]);
    const order = orders[0] || null;
    if (order && order.user && order.user.phone) {
      order.user.phone = decrypt(order.user.phone);
    }
    return order;
  } catch (error) {
    handleServiceError(
      error,
      "Erreur lors de la récupération du détail de la commande",
      { service: "orderService", operation: "getOrderWithDetails" }
    );
  }
};
