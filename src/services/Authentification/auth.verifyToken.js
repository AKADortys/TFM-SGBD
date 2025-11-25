const { hashToken, handleServiceError } = require("../../utils/service.util");
const Token = require("../../models/Token");
// Fonction de vérification du token de réinitialisation
module.exports = async (token, expectedType) => {
  try {
    const tokenHash = hashToken(token);
    const resetDoc = await Token.findOneAndUpdate(
      {
        token_hash: tokenHash,
        used: false,
        type: expectedType,
        expiresAt: { $gt: new Date() },
      },
      { $set: { used: true, usedAt: new Date() } },
      { new: false }
    );
    if (!resetDoc) return null;
    return resetDoc.userId;
  } catch (error) {
    handleServiceError(
      error,
      "Erreur lors de la vérification du lien de réinitialisation",
      { service: "authService", operation: "verifyToken" }
    );
  }
};
