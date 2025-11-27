const create = require("./User/user.create");
const update = require("./User/user.update");
const remove = require("./User/user.delete");
const getById = require("./User/user.getbyId");
const getUsers = require("./User/user.getUsers");

module.exports = {
  create,
  update,
  remove,
  getById,
  getUsers,
};
