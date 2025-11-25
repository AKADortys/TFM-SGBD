const express = require("express");
const router = express.Router();
const {
  create,
  update,
  remove,
  getById,
  getUsers,
} = require("../controllers/User/user.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");
const rateLimiter = require("../middlewares/rate-limiter.middleware");

router.get("/", tokenMdw, permissionsMdw, getUsers);
router.post("/", rateLimiter, create);
router.get("/:id", tokenMdw, permissionsMdw, getById);
router.put("/:id", tokenMdw, permissionsMdw, update);
router.delete("/:id", tokenMdw, permissionsMdw, remove);

module.exports = router;
