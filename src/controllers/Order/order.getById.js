const { getById } = require("../../services/orders.service");
const { isObjectId, handleResponse } = require("../../utils/controller.util");

// Récupération d'une commande par son ID
module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "ID manquant");
    const idError = isObjectId(id);
    if (idError) return handleResponse(res, 400, idError);
    const order = await getById(id);
    if (!order) return handleResponse(res, 404, "Commande non trouvée");
    if (req.user.id !== order.userId.toString() && req.user.role !== "admin") {
      return handleResponse(res, 403, "Accès refusé");
    }
    return handleResponse(res, 200, "Commande récupérée", order);
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
