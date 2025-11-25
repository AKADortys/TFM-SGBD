const User = require("../../models/User");
const {
  handleServiceError,
  sanitizeUser,
  decrypt,
} = require("../../utils/service.util");
// Mettre à jour le mot de passe d'un utilisateur
module.exports = async (id, newPassword) => {
  try {
    const user = await User.findById(id);
    if (!user) return null;

    user.password = newPassword;
    user.phone = decrypt(user.phone);
    await user.save();
    return sanitizeUser(user);
  } catch (error) {
    handleServiceError(
      error,
      "Erreur lors de la mise à jour du mot de passe de l'utilisateur",
      { service: "userService", operation: "updateUserPassword" }
    );
  }
};
