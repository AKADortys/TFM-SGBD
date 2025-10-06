const userService = require("./user.service");
const PasswordReset = require("../models/Password-reset");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const authService = {
  login: async (email, password) => {
    try {
      const user = await userService.getUserByMail(email);
      if (!user) {
        return null;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }

      const response = { ...user._doc };
      delete response.password;
      return response;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  createPasswordReset: async (userId, ip, userAgent) => {
    try {
      const token = crypto.randomBytes(48).toString("hex");

      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h
      await PasswordReset.create({
        userId,
        token_hash: tokenHash,
        expiresAt,
        requestIp: ip,
        userAgent,
      });

      return token;
    } catch (error) {
      console.error(error);
      throw new Error(
        "Erreur lors de le demande de changement de mot de passe"
      );
    }
  },
  verifyPasswordReset: async (token) => {
    try {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      const resetDoc = await PasswordReset.findOne({
        token_hash: tokenHash,
        used: false,
      });

      if (!resetDoc) {
        return null;
      }

      if (resetDoc.expiresAt < new Date()) {
        return null;
      }

      // Marquer comme utilisé
      resetDoc.used = true;
      resetDoc.usedAt = new Date();
      await resetDoc.save();

      return resetDoc.userId; // renvoyer l'utilisateur lié
    } catch (error) {
      console.error("Password reset verification error:", error);
      throw new Error(
        "Erreur lors de la vérification du lien de réinitialisation"
      );
    }
  },
};

module.exports = authService;
