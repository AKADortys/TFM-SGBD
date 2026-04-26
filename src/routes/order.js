const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.index");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");
const { authLimiter } = require("../middlewares/rate-limiter.middleware");
const checkStoreStatus = require("../middlewares/checkStoreStatus");

// Endpoint Stripe (Doit être avant le middleware d'authentification)
router.post("/webhook", controller.handleWebhook);

// Middleware d'authentification global
router.use(tokenMdw);

// Routes protégées par permissionsMdw
router.get("/", permissionsMdw, controller.getOrders);
router.get("/detail/:id", permissionsMdw, controller.detailOrder);
router.get("/user/:id", permissionsMdw, controller.getByUser);
router.get("/history", controller.getUserHist);
router.get("/checkout-session/:sessionId/verify", controller.verifyCheckoutSession); // Added endpoint
router.get("/:id", controller.getById);
router.post("/", authLimiter, checkStoreStatus, controller.create);
router.put("/:id", controller.update);
router.delete("/:id", permissionsMdw, controller.remove);
router.get("/stats/general", permissionsMdw, controller.generalStats);
router.get("/stats/by-date", permissionsMdw, controller.statsByDate);
router.post("/checkout-session", checkStoreStatus, controller.createCheckoutSession);
router.post("/checkout-session/:id/resume", checkStoreStatus, controller.resumeCheckoutSession);

module.exports = router;
