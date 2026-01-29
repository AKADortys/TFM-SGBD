const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.index");
const tokenMdw = require("../middlewares/jwt.middleware");
const mongoSanitize = require("express-mongo-sanitize");
const permissionsMdw = require("../middlewares/permissions.middleware");
const rateLimiter = require("../middlewares/rate-limiter.middleware");

// Middleware d'authentification global
router.use(tokenMdw);
router.use(mongoSanitize());

// Routes protégées par permissionsMdw
router.get("/", permissionsMdw, controller.getOrders);
router.get("/detail/:id", permissionsMdw, controller.detailOrder);
router.get("/user/:id", permissionsMdw, controller.getByUser);
router.get("/history", controller.getUserHist);
router.get("/:id", controller.getById);
router.post("/", rateLimiter, controller.create);
router.put("/:id", permissionsMdw, controller.update);
router.delete("/:id", permissionsMdw, controller.remove);
router.get("/stats/general", permissionsMdw, controller.generalStats);
router.get("/stats/by-date", permissionsMdw, controller.statsByDate);

module.exports = router;
