const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const validator = require("validator");
const authService = require("../services/authentification.service");

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      // Validation de l'email
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "L'email fourni est invalide" });
      }

      // Validation du mot de passe (minimum 8 caractères)
      if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json({
          message: "Le mot de passe doit faire au moins 8 caractères",
        });
      }

      // Vérification des identifiants
      const user = await authService.login(email, password);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // Génération des tokens
      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        jwtConfig.secret,
        {
          expiresIn: "1h",
        }
      );
      const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        jwtConfig.refreshSecret,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
        sameSite: "None",
        domain: "vivo-spa-vue-js.vercel.app",
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60, // 60 minutes
        sameSite: "None",
        domain: "vivo-spa-vue-js.vercel.app",
      });

      return res.json({ message: "Connexion réussie", user });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res) => {
    // Suppression des cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(200).json({ message: "Déconnexion réussie" });
  },
};

module.exports = authController;
