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
    stock: { type: Number, required: true, min: 0, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);
// 1. Trigger pour la méthode .save() (Création et mises à jour directes)
productSchema.pre("save", function (next) {
  if (this.stock <= 0) {
    this.isAvailable = false;
  }
  // Optionnel : Si on remet du stock, on peut repasser en true automatiquement ?
  if (this.stock > 0) this.isAvailable = true;
  next();
});

// 2. Trigger pour la méthode .findByIdAndUpdate() (Commandes clients)
// S'exécute APRÈS la mise à jour
productSchema.post("findOneAndUpdate", async function (doc) {
  // 'doc' est le document trouvé.
  if (doc) {
    const updatedProduct = await mongoose
      .model("Product")
      .findOne({ _id: doc._id });

    if (
      updatedProduct &&
      updatedProduct.stock <= 0 &&
      updatedProduct.isAvailable
    ) {
      updatedProduct.isAvailable = false;
      await updatedProduct.save(); // Cela déclenchera aussi le pre('save') du dessus
    }
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
