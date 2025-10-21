const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const authService = require("../services/authentification.service");
const mailService = require("../services/mail.service");
const userService = require("../services/user.service");
const {
  cookieOptions,
  validateEmail,
  validatePassword,
  createTokenPayload,
  handleResponse,
} = require("../utils/controller.util");

const authController = {
  // Connexion utilisateur
  login: async (req, res) => {
    try {
      const { mail, password } = req.body;

      if (!mail || !password) {
        return handleResponse(res, 400, "Email et mot de passe requis");
      }

      const emailError = validateEmail(mail);
      if (emailError) return handleResponse(res, 400, emailError);

      const passwordError = validatePassword(password);
      if (passwordError) return handleResponse(res, 400, passwordError);

      const user = await authService.login(mail, password);
      if (!user)
        return handleResponse(res, 401, "Email ou mot de passe incorrect");
      if (!user.isActive) {
        return handleResponse(res, 403, "Compte non activé");
      }

      const payload = createTokenPayload(user);
      const accessToken = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, {
        expiresIn: "7d",
      });

      res
        .cookie("accessToken", accessToken, cookieOptions(1000 * 60 * 60))
        .cookie(
          "refreshToken",
          refreshToken,
          cookieOptions(1000 * 60 * 60 * 24 * 7)
        );

      return handleResponse(res, 200, "Connexion réussie", { user });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return handleResponse(res, 500, "Erreur interne du serveur");
    }
  },

  // Déconnexion
  logout: (req, res) => {
    res.clearCookie("accessToken", cookieOptions(0));
    res.clearCookie("refreshToken", cookieOptions(0));
    return handleResponse(res, 200, "Déconnexion réussie");
  },

  // Réinitialisation du mot de passe (initiation)
  passwordReset: async (req, res) => {
    try {
      const { mail } = req.body;

      const emailError = validateEmail(mail);
      if (emailError) return handleResponse(res, 400, emailError);

      const user = await userService.getUserByMail(mail);
      if (!user)
        return handleResponse(res, 200, "Email de réinitialisation envoyé");

      const token = await authService.createToken(
        user._id,
        req.ip,
        req.headers["user-agent"] || "unknown"
      );

      await mailService.passReset(user, token);
      return handleResponse(res, 200, "Email de réinitialisation envoyé");
    } catch (error) {
      console.error("Erreur lors de la récupération du mot de passe :", error);
      return handleResponse(res, 500, "Erreur interne du serveur");
    }
  },

  // Réinitialisation du mot de passe (finalisation)
  passwordRecovery: async (req, res) => {
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
      const userId = await authService.verifyToken(
        trimmedToken,
        "password_reset"
      );
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
  },

  // Confirmation du compte utilisateur
  confirmAccount: async (req, res) => {
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
      const userId = await authService.verifyToken(
        trimmedToken,
        "account_confirmation"
      );
      if (!userId) {
        return handleResponse(
          res,
          400,
          "Lien de confirmation invalide ou expiré"
        );
      }
      await userService.confirmUserAccount(userId);
      return handleResponse(res, 200, "Compte confirmé avec succès");
    } catch (error) {
      console.error("Erreur lors de la confirmation du compte :", error);
      return handleResponse(res, 500, "Erreur interne du serveur");
    }
  },
};

module.exports = authController;
