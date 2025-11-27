const { remove, getById } = require("../../services/product.service");
const { handleResponse, isObjectId } = require("../../utils/controller.util");

// Suppression d'un produit par ID
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return handleResponse(res, 400, "ID manquant");
    if (isObjectId(id)) {
      return handleResponse(res, 400, "ID invalide");
    }
    const product = await getById(id);
    if (!product) {
      return handleResponse(res, 404, "Produit non trouvé");
    }
    await remove(id);
    return handleResponse(res, 200, "Produit supprimé avec succès");
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
