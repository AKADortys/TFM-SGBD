const express = require("express");
const router = express.Router();
const {
  getById,
  getProducts,
  create,
  update,
  remove,
} = require("../controllers/product.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");

router.get("/", getProducts);
router.get("/:id", getById);
router.post("/", tokenMdw, permissionsMdw, create);
router.put("/:id", tokenMdw, permissionsMdw, update);
router.delete("/:id", tokenMdw, permissionsMdw, remove);

module.exports = router;
