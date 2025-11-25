const {
  verifyToken,
} = require("../../services/Authentification/authentification.service");
const { confirmUserAccount } = require("../../services/User/user.service");
const { handleResponse } = require("../../utils/controller.util");
// Confirmation du compte utilisateur
module.exports = async (req, res) => {
  try {
    const { token } = req.body;
    const trimmedToken = (token || "").trim();
    if (!trimmedToken) {
      return handleResponse(
        res,
        400,
        "Lien de confirmation invalide ou expiré"
      );
    }
    const userId = await verifyToken(trimmedToken, "account_confirmation");
    if (!userId) {
      return handleResponse(
        res,
        400,
        "Lien de confirmation invalide ou expiré"
      );
    }
    await confirmUserAccount(userId);
    return handleResponse(res, 200, "Compte confirmé avec succès");
  } catch (error) {
    console.error("Erreur lors de la confirmation du compte :", error);
    return handleResponse(res, 500, "Erreur interne du serveur");
  }
};
