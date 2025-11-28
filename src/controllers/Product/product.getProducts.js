const { getProducts } = require("../../services/product.index");
const { handleResponse } = require("../../utils/controller.util");

// Récupération de tous les produits
module.exports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const products = await getProducts(page, limit, req.query);
    return handleResponse(res, 200, "Produits récupérés avec succès", products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
