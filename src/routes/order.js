const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.index");
const tokenMdw = require("../middlewares/jwt.middleware");
const mongoSanitize = require("express-mongo-sanitize");
const permissionsMdw = require("../middlewares/permissions.middleware");
const {
  apiLimiter,
  authLimiter,
} = require("../middlewares/rate-limiter.middleware");
const checkStoreStatus = require("../middlewares/checkStoreStatus");

// Endpoint Stripe (Doit être avant le middleware d'authentification)
router.post(
  "/webhook",
  express.raw({ type: 'application/json' }),
  controller.handleWebhook
);

// Middleware d'authentification global
router.use(tokenMdw);
router.use(mongoSanitize());
router.use(apiLimiter);

// Routes protégées par permissionsMdw
router.get("/", permissionsMdw, controller.getOrders);
router.get("/detail/:id", permissionsMdw, controller.detailOrder);
router.get("/user/:id", permissionsMdw, controller.getByUser);
router.get("/history", controller.getUserHist);
router.get("/:id", controller.getById);
router.post("/", authLimiter, checkStoreStatus, controller.create);
router.put("/:id", controller.update);
router.delete("/:id", permissionsMdw, controller.remove);
router.get("/stats/general", permissionsMdw, controller.generalStats);
router.get("/stats/by-date", permissionsMdw, controller.statsByDate);
router.post("/checkout-session", controller.createCheckoutSession);

module.exports = router;
