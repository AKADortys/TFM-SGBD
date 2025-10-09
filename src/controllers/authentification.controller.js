const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const authService = require("../services/authentification.service");
const mailService = require("../services/mail.service");
const userService = require("../services/user.service");
const utils = require("../utils/controller.util");

const authController = {
  // Connexion utilisateur
  login: async (req, res) => {
    try {
      const { mail, password } = req.body;
      const emailError = utils.validateEmail(mail);
      if (emailError) return res.status(400).json({ message: emailError });

      const passwordError = utils.validatePassword(password);
      if (passwordError)
        return res.status(400).json({ message: passwordError });

      const user = await authService.login(mail, password);
      if (!user)
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });

      const payload = utils.createTokenPayload(user);
      const accessToken = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, {
        expiresIn: "7d",
      });

      res
        .cookie("accessToken", accessToken, utils.cookieOptions(1000 * 60 * 60))
        .cookie(
          "refreshToken",
          refreshToken,
          utils.cookieOptions(1000 * 60 * 60 * 24 * 7)
        );

      res.json({ message: "Connexion réussie", user });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  },

  // Déconnexion
  logout: (req, res) => {
    res.clearCookie("accessToken", utils.cookieOptions(0));
    res.clearCookie("refreshToken", utils.cookieOptions(0));
    res.status(200).json({ message: "Déconnexion réussie" });
  },

  // Réinitialisation du mot de passe
  passRecovery: async (req, res) => {
    try {
      const { mail } = req.body;
      const emailError = utils.validateEmail(mail);
      if (emailError) return res.status(400).json({ message: emailError });

      const user = await userService.getUserByMail(mail);
      if (!user)
        return res
          .status(404)
          .json({ message: "Adresse mail fournie incorrecte" });

      const token = await authService.createPasswordReset(
        user._id,
        req.ip,
        req.headers["user-agent"] || "unknown"
      );
      await mailService.passReset(user, token);
      res.status(200).json({ message: "Demande traitée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

module.exports = authController;
