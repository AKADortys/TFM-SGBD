const {
  updateUser,
  getUserByMail,
  getUserById,
} = require("../../services/User/user.service");
const { updateUserSchema } = require("../../dto/user.dto");
const { isObjectId, handleResponse } = require("../../utils/controller.util");
// Modification d'un utilisateur
module.exports = async (req, res) => {
  const id = req.params.id;
  if (!id) return handleResponse(res, 400, "ID manquant");
  if (isObjectId(id)) {
    return handleResponse(res, 400, "ID invalide");
  }
  try {
    // Vérification de l'existence de l'utilisateur
    if (req.user.id !== id && req.user.role !== "admin") {
      return handleResponse(res, 403, "Accès refusé");
    }
    const user = await getUserById(id);
    if (!user) {
      return handleResponse(res, 404, "Utilisateur introuvable");
    }
    const { error, value } = updateUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((d) => d.message);
      return handleResponse(res, 400, errors);
    }
    const existingUser = await getUserByMail(value.mail);
    if (existingUser) {
      return handleResponse(res, 400, "Email déjà utilisé !");
    }
    // Mise à jour de l'utilisateur
    const updatedUser = await updateUser(id, value);

    if (!updatedUser) {
      return handleResponse(res, 404, "Utilisateur non trouvé");
    }
    return handleResponse(
      res,
      200,
      "Utilisateur modifié avec succès !",
      updatedUser
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return handleResponse(res, 500, "Erreur serveur");
  }
};
