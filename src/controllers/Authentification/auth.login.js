const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/jwt");
const {
  cookieOptions,
  validateEmail,
  validatePassword,
  createTokenPayload,
  handleResponse,
} = require("../../utils/controller.util");
const {
  login,
} = require("../../services/Authentification/authentification.service");

// Connexion utilisateur
module.exports = async (req, res) => {
  try {
    const { mail, password } = req.body;
    if (!mail || !password) {
      return handleResponse(res, 400, "Email et mot de passe requis");
    }
    const emailError = validateEmail(mail);
    if (emailError) return handleResponse(res, 400, emailError);
    const passwordError = validatePassword(password);
    if (passwordError) return handleResponse(res, 400, passwordError);
    const user = await login(mail, password);
    if (!user)
      return handleResponse(res, 401, "Email ou mot de passe incorrect");
    if (!user.isActive) {
      return handleResponse(res, 403, "Compte non activé");
    }
    const payload = createTokenPayload(user);
    const accessToken = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresToken,
    });
    const refreshToken = jwt.sign(payload, jwtConfig.secretRefresh, {
      expiresIn: jwtConfig.expiresRefreshToken,
    });
    res
      .cookie("accessToken", accessToken, cookieOptions(1000 * 60 * 60))
      .cookie(
        "refreshToken",
        refreshToken,
        cookieOptions(1000 * 60 * 60 * 24 * 7)
      );

    return handleResponse(res, 200, "Connexion réussie", user);
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return handleResponse(res, 500, "Erreur interne du serveur");
  }
};
