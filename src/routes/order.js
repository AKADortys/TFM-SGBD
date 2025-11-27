const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.index");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");
const rateLimiter = require("../middlewares/rate-limiter.middleware");

// Middleware d'authentification global
router.use(tokenMdw);

// Routes protégées par permissionsMdw
router.get("/", permissionsMdw, controller.getOrders);
router.get("/detail/:id", permissionsMdw, controller.detailOrder);
router.get("/user/:id", permissionsMdw, controller.getByUser);
router.get("/:id", controller.getById);
router.post("/", rateLimiter, controller.create);
router.put("/:id", permissionsMdw, controller.update);
router.delete("/:id", permissionsMdw, controller.remove);

module.exports = router;
