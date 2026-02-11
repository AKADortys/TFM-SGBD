const express = require("express");
const router = express.Router();
const configController = require("../controllers/Config/config.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
const permissionsMdw = require("../middlewares/permissions.middleware");


router.get("/", configController.getConfig);
router.patch("/", tokenMdw, permissionsMdw, configController.updateConfig);

module.exports = router;
