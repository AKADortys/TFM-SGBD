const {
  cookieOptions,
  handleResponse,
} = require("../../utils/controller.util");

// Déconnexion
module.exports = (req, res) => {
  res.clearCookie("accessToken", cookieOptions(0));
  res.clearCookie("refreshToken", cookieOptions(0));
  return handleResponse(res, 200, "Déconnexion réussie");
};
