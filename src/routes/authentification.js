const express = require("express");
const router = express.Router();
const controller = require("../controllers/authentification.index");
const tokenMdw = require("../middlewares/jwt.middleware");
const {
  apiLimiter,
  authLimiter,
} = require("../middlewares/rate-limiter.middleware");
const mongoSanitize = require("express-mongo-sanitize");

router.use(mongoSanitize());
router.post("/login", authLimiter, controller.login);
router.post("/logout", apiLimiter, tokenMdw, controller.logout);
router.post("/password-reset", authLimiter, controller.passwordReset);
router.post("/password-recovery", authLimiter, controller.passwordRecovery);
router.post("/confirm-account", authLimiter, controller.confirmAccount);

module.exports = router;
