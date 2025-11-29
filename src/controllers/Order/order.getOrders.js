const { getOrders } = require("../../services/orders.index");
const { handleResponse } = require("../../utils/controller.util");

// Récupération de tous les commandes
module.exports = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const result = await getOrders(page, limit, {
      ...req.query,
    });
    return handleResponse(res, 200, "commandes récupérées", result);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return handleResponse(res, 500, "Erreur serveur");
  }
};
