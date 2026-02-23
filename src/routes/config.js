const express = require("express");
const router = express.Router();
const configController = require("../controllers/Config/config.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");
const mongoSanitize = require("express-mongo-sanitize");
const { apiLimiter } = require("../middlewares/rate-limiter.middleware");

router.get("/", configController.getConfig);
router.patch(
  "/",
  tokenMdw,
  permissionsMdw,
  mongoSanitize(),
  apiLimiter,
  configController.updateConfig,
);

module.exports = router;
