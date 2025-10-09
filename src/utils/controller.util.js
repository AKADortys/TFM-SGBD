const validator = require("validator");
const { ObjectId } = require("mongodb");
module.exports = {
  // Validation d'email
  validateEmail(email) {
    if (!validator.isEmail(email)) {
      return "L'email fourni est invalide";
    }
    return null;
  },
  // Validation de mot de passe
  validatePassword(password) {
    if (!validator.isLength(password, { min: 8 })) {
      return "Le mot de passe doit faire au moins 8 caractères";
    }
    return null;
  },
  // Options pour les cookies
  cookieOptions: (maxAge) => ({
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge,
  }),
  // Création du payload pour les tokens
  createTokenPayload: (user) => ({
    id: user._id,
    role: user.role,
    fullname: `${user.name} ${user.lastName}`,
    mail: user.mail,
  }),
  // Validation d'un ObjectId MongoDB
  isObjectId: (id) => {
    if (!ObjectId.isValid(id)) {
      return "ID invalide";
    }
    return null;
  },
  // Gestion des réponses standardisées
  handleResponse: (res, status, message, data = null) => {
    const payload = { message };
    if (data !== null) payload.data = data;
    return res.status(status).json(payload);
  },
};
