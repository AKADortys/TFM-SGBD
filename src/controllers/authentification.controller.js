const login = require("./Authentification/auth.login");
const confirmAccount = require("./Authentification/auth.confirmAccount");
const logout = require("./Authentification/auth.logout");
const passwordRecovery = require("./Authentification/auth.passwordRecovery");
const passwordReset = require("./Authentification/auth.passwordReset");

module.exports = {
  login,
  logout,
  confirmAccount,
  passwordRecovery,
  passwordReset,
};
