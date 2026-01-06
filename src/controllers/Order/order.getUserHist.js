const { getByUser } = require("../../services/orders.index");
const { isObjectId, handleResponse } = require("../../utils/controller.util");

// Récupération des commandes par son userId
module.exports = async (req, res) => {
  try {
    const skip = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const { id } = req.user;
    if (!id) return handleResponse(res, 400, "ID invalide");
    const idError = isObjectId(id);
    if (idError) return handleResponse(res, 400, idError);
    if (req.user.id !== id && req.user.role !== "admin") {
      return handleResponse(res, 403, "Accès refusé");
    }
    const result = await getByUser(id, skip, limit, { ...req.query });
    return handleResponse(
      res,
      200,
      "Historique des commandes récupéré",
      result
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes par userId:",
      error
    );
    return handleResponse(res, 500, "Erreur Server");
  }
};
