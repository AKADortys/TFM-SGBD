const login = require("./Authentification/auth.login");
const createToken = require("./Authentification/auth.createToken");
const verifyToken = require("./Authentification/auth.verifyToken");
module.exports = { login, verifyToken, createToken };
