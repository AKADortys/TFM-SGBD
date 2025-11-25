const login = require("./auth.login");
const confirmAccount = require("./auth.confirmAccount");
const logout = require("./auth.logout");
const passwordRecovery = require("./auth.passwordRecovery");
const passwordReset = require("./auth.passwordReset");

module.exports = {
  login,
  logout,
  confirmAccount,
  passwordRecovery,
  passwordReset,
};
