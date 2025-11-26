const { getUserById } = require("../../services/user.service");
const { isObjectId, handleResponse } = require("../../utils/controller.util");
// Récupération d'un utilisateur par ID
module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    if (isObjectId(id)) {
      return handleResponse(res, 400, "ID invalide");
    }
    const user = await getUserById(id);
    if (!user) {
      return handleResponse(res, 404, "Utilisateur non trouvé");
    }
    return handleResponse(res, 200, "Utilisateur récupéré avec succès", user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
