const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  passwordRecovery,
  passwordReset,
  confirmAccount,
} = require("../controllers/authentification.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const rateLimiter = require("../middlewares/rate-limiter.middleware");

router.post("/login", rateLimiter, login);
router.post("/logout", tokenMdw, logout);
router.post("/password-reset", rateLimiter, passwordReset);
router.patch("/password-recovery", rateLimiter, passwordRecovery);
router.patch("/confirm-account", rateLimiter, confirmAccount);

module.exports = router;
