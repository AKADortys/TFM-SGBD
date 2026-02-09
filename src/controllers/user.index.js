const create = require("./User/user.create");
const update = require("./User/user.update");
const remove = require("./User/user.delete");
const getById = require("./User/user.getbyId");
const getUsers = require("./User/user.getUsers");
const generalStats = require("./User/user.generalStats");
const me = require("./User/user.me");

module.exports = {
  create,
  update,
  remove,
  getById,
  getUsers,
  generalStats,
  me
};
