const getProducts = require("./Product/product.getProducts");
const create = require("./Product/product.create");
const remove = require("./Product/product.delete");
const update = require("./Product/product.update");
const getById = require("./Product/product.getById");
const getByIds = require("./Product/product.getByIds");

module.exports = { getProducts, create, remove, update, getById, getByIds };
