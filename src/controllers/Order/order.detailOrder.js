const { detailOrder } = require("../../services/orders.index");
const { isObjectId, handleResponse } = require("../../utils/controller.util");

// Récupération des commandes avec détails (produits)
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isObjectId(id)) {
      return handleResponse(res, 400, "ID invalide");
    }
    const order = await detailOrder(id);
    if (order === null) return handleResponse(res, 404, "Aucunes commande");
    return handleResponse(res, 200, "commandes récupérées avec succès", order);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
