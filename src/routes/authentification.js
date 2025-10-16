const express = require("express");
const router = express.Router();
const authController = require("../controllers/authentification.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const rateLimiter = require("../middlewares/rate-limiter.middleware");

router.post("/login", rateLimiter, authController.login);
router.post("/logout", tokenMdw, authController.logout);
router.post("/password-reset", rateLimiter, authController.passwordReset);
router.patch(
  "/password-recovery",
  rateLimiter,
  authController.passwordRecovery
);
router.patch("/confirm-account", rateLimiter, authController.confirmAccount);

module.exports = router;
