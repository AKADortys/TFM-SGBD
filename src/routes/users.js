const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.index");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");
const {
  apiLimiter,
  authLimiter,
} = require("../middlewares/rate-limiter.middleware");
const mongoSanitize = require("express-mongo-sanitize");
router.use(mongoSanitize());
router.use(apiLimiter);
router.get("/", tokenMdw, permissionsMdw, controller.getUsers);
router.post("/", authLimiter, controller.create);
router.get("/me", tokenMdw, controller.me);
router.get("/:id", tokenMdw, permissionsMdw, controller.getById);
router.put("/:id", tokenMdw, permissionsMdw, controller.update);
router.delete("/:id", tokenMdw, permissionsMdw, controller.remove);
router.get("/stats/general", tokenMdw, permissionsMdw, controller.generalStats);


module.exports = router;
