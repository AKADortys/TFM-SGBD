const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");

router.get("/", tokenMdw, permissionsMdw, userController.getUsers);
router.post("/", userController.createUser);
router.get("/:id", tokenMdw, permissionsMdw, userController.getUserById);
router.put("/:id", tokenMdw, permissionsMdw, userController.updateUser);
router.delete("/:id", tokenMdw, permissionsMdw, userController.deleteUser);

module.exports = router;
