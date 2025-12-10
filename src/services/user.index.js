const getUsers = require("./User/user.getUsers");
const getUserById = require("./User/user.getById");
const getUserByMail = require("./User/user.getByMail");
const createUser = require("./User/user.create");
const updateUser = require("./User/user.update");
const updateUserPassword = require("./User/user.updatePassword");
const deleteUser = require("./User/user.delete");
const confirmUserAccount = require("./User/user.activateAccount");
const generalStats = require("./User/user.generalStats");

module.exports = {
  getUsers,
  getUserById,
  getUserByMail,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  confirmUserAccount,
  generalStats,
};
