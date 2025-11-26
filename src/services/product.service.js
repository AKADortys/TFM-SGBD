const getProducts = require("./Product/product.getProducts");
const create = require("./Product/product.create");
const remove = require("./Product/product.delete");
const update = require("./Product/product.update");
const getById = require("./Product/product.getById");

module.exports = { getProducts, create, remove, update, getById };
