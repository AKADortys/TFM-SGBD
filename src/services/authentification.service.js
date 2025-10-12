const userService = require("./user.service");
const Token = require("../models/Password-reset");
const bcrypt = require("bcrypt");
const {
  hashToken,
  generateToken,
  sanitizeUser,
  handleServiceError,
  isExpired,
} = require("../utils/service.util");

const authService = {
  login: async (email, password) => {
    try {
      const user = await userService.getUserByMail(email);
      if (!user) return null;
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return null;
      return sanitizeUser(user);
    } catch (error) {
      handleServiceError(error, "Erreur lors de la connexion");
    }
  },

  createToken: async (userId, ip, userAgent) => {
    try {
      const token = generateToken();
      const tokenHash = hashToken(token);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await Token.create({
        userId,
        token_hash: tokenHash,
        expiresAt,
        requestIp: ip,
        userAgent,
      });

      return token;
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la demande de changement de mot de passe"
      );
    }
  },

  verifyToken: async (token) => {
    try {
      const tokenHash = hashToken(token);
      const resetDoc = await Token.findOne({
        token_hash: tokenHash,
        used: false,
      });
      if (!resetDoc || isExpired(resetDoc.expiresAt)) return null;

      resetDoc.used = true;
      resetDoc.usedAt = new Date();
      await resetDoc.save();
      return resetDoc.userId;
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la vérification du lien de réinitialisation"
      );
    }
  },
};

module.exports = authService;
