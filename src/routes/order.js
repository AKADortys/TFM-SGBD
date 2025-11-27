const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");
const rateLimiter = require("../middlewares/rate-limiter.middleware");

// Middleware d'authentification global
router.use(tokenMdw);

// Routes protégées par permissionsMdw
router.get("/", permissionsMdw, orderController.getOrders);
router.get("/detail/:id", permissionsMdw, orderController.detailOrder);
router.get("/user/:id", permissionsMdw, orderController.getByUser);
router.get("/:id", orderController.getById);
router.post("/", rateLimiter, orderController.create);
router.put("/:id", permissionsMdw, orderController.update);
router.delete("/:id", permissionsMdw, orderController.remove);

module.exports = router;
