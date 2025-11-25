const User = require("../../models/User");
const {
  handleServiceError,
  sanitizeUser,
  decrypt,
} = require("../../utils/service.util");
// Créer un nouvel utilisateur
module.exports = async (value) => {
  try {
    const user = new User(value);
    await user.save();
    if (user.phone) {
      user.phone = decrypt(user.phone);
    }
    return sanitizeUser(user);
  } catch (error) {
    handleServiceError(error, "Erreur lors de la création de l'utilisateur", {
      service: "userService",
      operation: "createUser",
    });
  }
};
