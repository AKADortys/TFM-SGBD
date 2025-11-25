const getSearch = require("./user.getUsers");
const getUser = require("./user.getById");
const getByMail = require("./user.getByMail");
const add = require("./user.create");
const update = require("./user.update");
const patchPwd = require("./user.updatePassword");
const remove = require("./user.delete");
const activeAcc = require("./user.activateAccount");

const userService = {
  getUsers: (askPage, limit, searchTerm = "") =>
    getSearch(askPage, limit, searchTerm),

  getUserById: (id) => getUser(id),

  getUserByMail: (mail) => getByMail(mail),

  createUser: (value) => add(value),

  updateUser: (id, updateFields) => update(id, updateFields),

  updateUserPassword: (id, newPassword) => patchPwd(id, newPassword),

  deleteUser: (id) => remove(id),

  confirmUserAccount: (id) => activeAcc(id),
};

module.exports = userService;
