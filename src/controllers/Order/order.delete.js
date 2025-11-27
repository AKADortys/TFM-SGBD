const { getById, remove } = require("../../services/orders.service");
const { isObjectId, handleResponse } = require("../../utils/controller.util");

// Suppression d'une commande
module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const idError = isObjectId(id);
    if (idError) return handleResponse(res, 400, idError);
    const order = await getById(id);
    if (!order) {
      return handleResponse(res, 404, "Commande introuvable");
    }
    await remove(id);
    return handleResponse(res, 200, "Commande supprimée avec succès");
  } catch (error) {
    console.error("erreur lors de la suppresion", error);
    return handleResponse(res, 500, "Erreur server");
  }
};
