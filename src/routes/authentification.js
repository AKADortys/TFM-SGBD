const express = require("express");
const router = express.Router();
const controller = require("../controllers/authentification.index");
const tokenMdw = require("../middlewares/jwt.middleware");
const rateLimiter = require("../middlewares/rate-limiter.middleware");
const mongoSanitize = require("express-mongo-sanitize");

router.use(mongoSanitize());
router.post("/login", rateLimiter, controller.login);
router.post("/logout", tokenMdw, controller.logout);
router.post("/password-reset", rateLimiter, controller.passwordReset);
router.post("/password-recovery", rateLimiter, controller.passwordRecovery);
router.post("/confirm-account", rateLimiter, controller.confirmAccount);

module.exports = router;
