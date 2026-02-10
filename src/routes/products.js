const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.index");
const mongoSanitize = require("express-mongo-sanitize");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");
const { apiLimiter } = require("../middlewares/rate-limiter.middleware");
const checkStoreStatus = require("../middlewares/checkStoreStatus");

router.use(mongoSanitize());
router.use(apiLimiter);

router.get("/", controller.getProducts);
router.get("/:id", controller.getById);
router.post("/", tokenMdw, permissionsMdw, controller.create);
router.put("/:id", tokenMdw, permissionsMdw, controller.update);
router.delete("/:id", tokenMdw, permissionsMdw, controller.remove);

module.exports = router;
