const validator = require("validator");

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
};
