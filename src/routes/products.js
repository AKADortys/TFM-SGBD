const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post("/", tokenMdw, permissionsMdw, productController.createProduct);
router.put("/:id", tokenMdw, permissionsMdw, productController.updateProduct);
router.delete(
  "/:id",
  tokenMdw,
  permissionsMdw,
  productController.deleteProduct
);

module.exports = router;
