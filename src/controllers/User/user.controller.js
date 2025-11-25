const create = require("./user.create");
const update = require("./user.update");
const remove = require("./user.delete");
const getById = require("./user.getbyId");
const getUsers = require("./user.getUsers");

module.exports = {
  create,
  update,
  remove,
  getById,
  getUsers,
};
