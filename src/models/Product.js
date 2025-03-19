const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    label: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Plat principal", "Dessert", "Boisson", "Divers"],
      default: "Divers",
    },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
