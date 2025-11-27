const {
  handleServiceError,
  sanitizeUser,
  decrypt,
} = require("../../utils/service.util");
const User = require("../../models/User");

// Récupérer un utilisateur par ID
module.exports = async (id) => {
  try {
    const user = await User.findById(id);
    if (user && user.phone) {
      user.phone = decrypt(user.phone);
    }
    return sanitizeUser(user) || null;
  } catch (error) {
    handleServiceError(
      error,
      "Erreur lors de la récupération de l'utilisateur",
      { service: "userService", operation: "getUserById" }
    );
  }
};
