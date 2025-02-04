const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const tokenMdw = require("../middlewares/jwt.middleware");

router.get("/", tokenMdw, userController.getUsers);
router.post("/", userController.createUser);
router.get("/:id", tokenMdw, userController.getUserById);
router.put("/:id", tokenMdw, userController.updateUser);
router.delete("/:id", tokenMdw, userController.deleteUser);

module.exports = router;
