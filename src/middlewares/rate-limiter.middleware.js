const { rateLimit } = require("express-rate-limit");

module.exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Trop de requêtes de cette IP, veuillez réessayer plus tard.",
});

module.exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts.",
});
