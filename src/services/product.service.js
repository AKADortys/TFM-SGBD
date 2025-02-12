const Product = require("../models/product");

module.exports = {
  getAllProducts: async () => {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getProductById: async (id) => {
    try {
      const product = await Product.findById(id);
      if (!product) return null;
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  createProduct: async (productData) => {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updateProduct: async (id, updateData) => {
    try {
      const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!product) return null;
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  deleteProduct: async (id) => {
    try {
      await Product.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
