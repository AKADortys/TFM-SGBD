const {
  hashToken,
  generateToken,
  handleServiceError,
} = require("../../utils/service.util");
const Token = require("../../models/Token");
// Fonction de  création de token de réinitialisation
module.exports = async (userId, ip, userAgent, type = "password_reset") => {
  try {
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await Token.create({
      userId,
      token_hash: tokenHash,
      expiresAt,
      requestIp: ip,
      type,
      userAgent,
    });
    return token;
  } catch (error) {
    handleServiceError(error, "Erreur lors de la création du token", {
      service: "authService",
      operation: "createToken",
    });
  }
};
