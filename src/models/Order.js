const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    deliveryAddress: { type: String },
    status: {
      type: String,
      enum: [
        "En attente",
        "Confirmée",
        "Prêt en magasin",
        "Refusée",
        "Annulée",
      ],
      default: "En attente",
    },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
