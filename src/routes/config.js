const express = require("express");
const router = express.Router();
const configController = require("../controllers/Config/config.controller");
const tokenMdw = require("../middlewares/jwt.middleware");
// Assuming you have an authentication middleware for admin override
// const authAdmin = require("../middlewares/authAdmin"); 

// Get config (public or authenticated?) - Public allows checking store status
router.get("/", configController.getConfig);

// Update config (Admin only - need to implement/import admin check later if not available here)
// For now, I will assume the user has a way to protect this, possibly in the main index.js or by importing a middleware
// I'll check how other routes are protected.
const permissionsMdw = require("../middlewares/permissions.middleware"); // Admin check

router.patch("/", tokenMdw, permissionsMdw, configController.updateConfig); // Admin protected

module.exports = router;
