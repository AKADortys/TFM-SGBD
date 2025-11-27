const { getById } = require("../../services/product.service");
const { handleResponse, isObjectId } = require("../../utils/controller.util");

// Récupération d'un produit par ID
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
    return handleResponse(res, 200, "Produit récupéré avec succès", product);
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
