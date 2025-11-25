const {
  getUserByMail,
  createUser,
} = require("../../services/User/user.service");
const {
  createToken,
} = require("../../services/Authentification/authentification.service");
const { userSchema } = require("../../dto/user.dto");
const mailService = require("../../services/mail.service");
const { handleResponse } = require("../../utils/controller.util");
// Création d'un nouvel utilisateur
module.exports = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((d) => d.message);
      return handleResponse(res, 400, errors);
    }
    const existingUser = await getUserByMail(value.mail);
    if (existingUser) {
      return handleResponse(res, 400, "Email déjà utilisé !");
    }
    const newUser = await createUser(value);
    const token = await createToken(
      newUser._id,
      req.ip,
      req.get("User-Agent"),
      "account_confirmation"
    );
    await mailService.welcomeMail(newUser, token);
    return handleResponse(res, 201, "Utilisateur créé avec succès", newUser);
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Erreur serveur");
  }
};
