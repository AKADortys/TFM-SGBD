const { deleteUser, getUserById } = require("../../services/user.service");
const { isObjectId, handleResponse } = require("../../utils/controller.util");
// Suppression d'un utilisateur
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id && req.user.role !== "admin") {
      return handleResponse(res, 403, "Accès refusé");
    }
    if (!id) return handleResponse(res, 400, "ID manquant");
    if (!isObjectId(id)) {
      return handleResponse(res, 400, "ID invalide");
    }
    const user = await getUserById(id);
    if (!user) {
      return handleResponse(res, 404, "Utilisateur introuvable");
    }
    await deleteUser(id);
    return handleResponse(res, 200, "Utilisateur supprimé avec succès !");
  } catch (error) {
    return handleResponse(res, 500, "Erreur serveur");
  }
};
