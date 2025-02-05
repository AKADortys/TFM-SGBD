const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");

router.use(tokenMdw);

router.get("/", permissionsMdw, orderController.getAllOrders);
router.get("/detail", permissionsMdw, orderController.getOrdersWithDetails);
router.get("/:id", orderController.getOrderById);
router.get("/user/:id", permissionsMdw, orderController.getUserOrders);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
