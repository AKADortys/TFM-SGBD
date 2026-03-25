const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.index");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");
const { authLimiter } = require("../middlewares/rate-limiter.middleware");

router.get("/", tokenMdw, permissionsMdw, controller.getUsers);
router.post("/", authLimiter, controller.create);
router.get("/me", tokenMdw, controller.me);
router.get("/stats/general", tokenMdw, permissionsMdw, controller.generalStats);
router.get("/:id", tokenMdw, permissionsMdw, controller.getById);
router.put("/:id", tokenMdw, permissionsMdw, controller.update);
router.delete("/:id", tokenMdw, permissionsMdw, controller.remove);


module.exports = router;
