const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const tokenMdw = require("../middlewares/jwt");

router.get("/", tokenMdw, userController.getUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
