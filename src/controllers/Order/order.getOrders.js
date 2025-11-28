const { getOrders } = require("../../services/orders.index");
const { handleResponse } = require("../../utils/controller.util");

// Récupération de tous les commandes
module.exports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await getOrders(page, limit, {
      ...req.query,
    });
    return handleResponse(res, 200, "commandes récupérées", result);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return handleResponse(res, 500, "Erreur serveur");
  }
};
