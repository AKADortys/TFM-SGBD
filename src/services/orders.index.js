const create = require("./Order/order.create");
const remove = require("./Order/order.delete");
const detailOrder = require("./Order/order.detailOrder");
const getById = require("./Order/order.getById");
const getByUser = require("./Order/order.getByUser");
const getOrders = require("./Order/order.getOrders");
const update = require("./Order/order.update");
const generalStats = require("./Order/order.generalStats");
const statsByDate = require("./Order/order.statsByDate");
const createCheckoutSession = require("./Order/order.createCheckoutSession");
const handleWebhook = require("./Order/order.webhook");

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
  createCheckoutSession,
  handleWebhook,
};
