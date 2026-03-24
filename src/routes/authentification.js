const express = require("express");
const router = express.Router();
const controller = require("../controllers/authentification.index");
const tokenMdw = require("../middlewares/jwt.middleware");
const { authLimiter } = require("../middlewares/rate-limiter.middleware");

router.post("/login", authLimiter, controller.login);
router.post("/logout", tokenMdw, controller.logout);
router.post("/password-reset", authLimiter, controller.passwordReset);
router.post("/password-recovery", authLimiter, controller.passwordRecovery);
router.post("/confirm-account", authLimiter, controller.confirmAccount);

module.exports = router;
