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
        productName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    deliveryAddress: {
      street: { type: String, required: false },
      city: { type: String, required: false },
      zipCode: { type: String, required: false },
      coordinates: {
        lat: { type: Number, required: false },
        lng: { type: Number, required: false },
      },
    },
    status: {
      type: String,
      enum: [
        "En attente",
        "Payée",
        "En préparation",
        "Refusée",
        "Annulée",
        "Terminée",
      ],
      default: "Payée",
    },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
