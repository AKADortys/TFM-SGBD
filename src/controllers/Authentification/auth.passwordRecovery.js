const {
  verifyToken,
} = require("../../services/Authentification/authentification.service");
const { updateUserPassword } = require("../../services/User/user.service");
const {
  validatePassword,
  handleResponse,
} = require("../../utils/controller.util");
// Réinitialisation du mot de passe (finalisation)
module.exports = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const trimmedToken = (token || "").trim();
    if (!trimmedToken) {
      return handleResponse(
        res,
        400,
        "Lien de réinitialisation invalide ou expiré"
      );
    }

    const passwordError = validatePassword(newPassword || "");
    if (passwordError) return handleResponse(res, 400, passwordError);
    const userId = await verifyToken(trimmedToken, "password_reset");
    if (!userId)
      return handleResponse(
        res,
        400,
        "Lien de réinitialisation invalide ou expiré"
      );
    await userService.updateUserPassword(userId, newPassword);
    return handleResponse(res, 200, "Mot de passe réinitialisé avec succès");
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    return handleResponse(res, 500, "Erreur interne du serveur");
  }
};
