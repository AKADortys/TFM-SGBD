const validator = require("validator");
const { ObjectId } = require("mongodb");
module.exports = {
  validateEmail(email) {
    if (!validator.isEmail(email)) {
      return "L'email fourni est invalide";
    }
    return null;
  },

  validatePassword(password) {
    if (!validator.isLength(password, { min: 8 })) {
      return "Le mot de passe doit faire au moins 8 caractères";
    }
    return null;
  },
  cookieOptions: (maxAge) => ({
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge,
  }),

  createTokenPayload: (user) => ({
    id: user._id,
    role: user.role,
    fullname: `${user.name} ${user.lastName}`,
    mail: user.mail,
  }),

  isObjectId: (id) => {
    if (!ObjectId.isValid(id)) {
      return "ID invalide";
    }
    return null;
  },
};
