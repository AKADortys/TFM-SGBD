const { createToken } = require("../../services/authentification.service");
const mailService = require("../../services/mail.service");
const { getUserByMail } = require("../../services/user.service");
const {
  validateEmail,
  handleResponse,
} = require("../../utils/controller.util");

// Réinitialisation du mot de passe (initiation)
module.exports = async (req, res) => {
  try {
    const { mail } = req.body;
    const emailError = validateEmail(mail);
    if (emailError) return handleResponse(res, 400, emailError);

    const user = await getUserByMail(mail);
    if (!user)
      return handleResponse(res, 200, "Email de réinitialisation envoyé");

    const token = await createToken(
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
};
