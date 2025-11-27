const { update } = require("../../services/product.index");
const { updateProductSchema } = require("../../dto/product.dto");
const { handleResponse, isObjectId } = require("../../utils/controller.util");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return handleResponse(res, 400, "ID manquant");
    if (isObjectId(id)) {
      return handleResponse(res, 400, "ID invalide");
    }

    const { error, value } = updateProductSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return handleResponse(res, 400, errors);
    }

    const updatedProduct = await update(id, value);

    if (!updatedProduct) {
      return handleResponse(res, 404, "Produit non trouvé");
    }
    return handleResponse(
      res,
      200,
      "Produit mis à jour avec succès",
      updatedProduct
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
