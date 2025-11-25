const getUsers = require("./user.getUsers");
const getUserById = require("./user.getById");
const getUserByMail = require("./user.getByMail");
const createUser = require("./user.create");
const updateUser = require("./user.update");
const updateUserPassword = require("./user.updatePassword");
const deleteUser = require("./user.delete");
const confirmUserAccount = require("./user.activateAccount");

module.exports = {
  getUsers,
  getUserById,
  getUserByMail,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  confirmUserAccount,
};
