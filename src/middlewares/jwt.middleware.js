const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!token && !refreshToken) {
      return res.status(403).json({ message: "Token manquant" });
    }
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      // console.log(decoded);
      req.user = decoded;
      return next();
    } catch (error) {
      if (
        (error.name === "JsonWebTokenError" ||
          error.name === "TokenExpiredError") &&
        refreshToken
      ) {
        console.log("Access token expiré, tentative de rafraîchissement...");

        const newAccessToken = await refreshTokenFunction(refreshToken);
        if (!newAccessToken) {
          return res.status(401).json({ message: "Refresh token invalide" });
        }

        // Sauvegarde le nouveau token dans le cookie
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 60,
          sameSite: "None",
          path: "/",
        });

        req.user = jwt.verify(newAccessToken, jwtConfig.secret);
        return next();
      }
      return res
        .status(401)
        .json({ message: "Token invalide ou expiré", error });
    }
  } catch (error) {
    console.error("Erreur JWT:", error);
    return res.status(500).json({ message: "Erreur d'authentification" });
  }
};

// Fonction pour générer un nouvel access token à partir du refresh token
const refreshTokenFunction = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);

    // Génération d'un nouvel access token avec les infos de l'utilisateur
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
        fullname: decoded.fullname,
        mail: decoded.mail,
      }, // Données du user à inclure
      jwtConfig.secret,
      { expiresIn: "1h" }
    );

    return newAccessToken;
  } catch (err) {
    console.error("Erreur lors du rafraîchissement du token:", err);
    return null;
  }
};
