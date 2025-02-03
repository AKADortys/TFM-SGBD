const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    // Validation du token
    if (!token) {
      return res.status(403).json({ message: "Token manquant" });
    }

    // Vérifie et décode le token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Attacher les informations du token à la requête
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Erreur JWT:", error);

    // Gère les erreurs spécifiques liées au token
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expiré, veuillez vous reconnecter" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token invalide" });
    } else {
      return res.status(500).json({ message: "Erreur d'authentification" });
    }
  }
};
