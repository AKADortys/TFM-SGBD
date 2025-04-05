const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");

// Middleware d'authentification global
router.use(tokenMdw);

// Routes protégées par permissionsMdw
router.get("/", permissionsMdw, orderController.getAllOrders);
router.get("/detail", permissionsMdw, orderController.getOrdersWithDetails);
router.get("/user/:id", permissionsMdw, orderController.getUserOrders);
router.get(
  "/status/:status",
  permissionsMdw,
  orderController.getOrdersByStatus
);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
