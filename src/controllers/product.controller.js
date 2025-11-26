const getProducts = require("./Product/product.getProducts");
const create = require("./Product/product.create");
const remove = require("./Product/product.delete");
const getById = require("./Product/product.getById");
const update = require("./Product/product.update");

module.exports = { create, update, getById, remove, getProducts };
