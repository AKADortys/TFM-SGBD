const create = require("./Order/order.create");
const remove = require("./Order/order.delete");
const detailOrder = require("./Order/order.detailOrder");
const getById = require("./Order/order.getById");
const getByUser = require("./Order/order.getByUser");
const getOrders = require("./Order/order.getOrders");
const update = require("./Order/order.update");
const generalStats = require("./Order/order.generalStats");
const statsByDate = require("./Order/order.statsByDate");
const getUserHist = require("./Order/order.getUserHist");

module.exports = {
  create,
  remove,
  detailOrder,
  getById,
  getByUser,
  getOrders,
  update,
  generalStats,
  statsByDate,
  getUserHist,
};
