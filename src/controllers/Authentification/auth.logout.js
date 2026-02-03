const {
  cookieOptions,
  handleResponse,
} = require("../../utils/controller.util");
const Token = require("../../models/Token");
const { hashToken } = require("../../utils/service.util");

// Déconnexion
module.exports = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await Token.deleteOne({
        token_hash: hashToken(refreshToken),
        type: "refresh_token",
      });
    }
    res.clearCookie("accessToken", cookieOptions(0));
    res.clearCookie("refreshToken", cookieOptions(0));
    return handleResponse(res, 200, "Déconnexion réussie");
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};
