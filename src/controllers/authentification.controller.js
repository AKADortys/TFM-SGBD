const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const validator = require("validator");
const authService = require("../services/authentification.service");
const mailService = require("../services/mail.service");
const userService = require("../services/user.service");
const { message } = require("statuses");

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
        {
          id: user._id,
          role: user.role,
          fullname: user.name + " " + user.lastName,
          mail: user.mail,
        },
        jwtConfig.secret,
        {
          expiresIn: "1h",
        }
      );
      const refreshToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
          fullname: user.name + " " + user.lastName,
          mail: user.mail,
        },
        jwtConfig.refreshSecret,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "None",
        path: "/",
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60,
        sameSite: "None",
        path: "/",
      });

      return res.json({ message: "Connexion réussie", user });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res) => {
    // Suppression des cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    return res.status(200).json({ message: "Déconnexion réussie" });
  },
  // Récupération mot de passe
  passRecovery: async (req, res) => {
    try {
      const { mail } = req.body;
      // Validation de l'email
      if (!validator.isEmail(mail)) {
        return res.status(400).json({ message: "L'email fourni est invalide" });
      }
      const user = await userService.getUserByMail(mail);
      if (!user) {
        res.status(404).json({ message: "Addresse mail incorrecte" });
      } else {
        const ip = req.ip;
        const ua = req.headers["user-agent"] || "unknown";
        const token = await authService.createPasswordReset(user._id, ip, ua);
        await mailService.passReset(user, token);
        res
          .status(200)
          .json({ message: "Votre demande à été traitée avec succès" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur server" });
    }
  },
};

module.exports = authController;
