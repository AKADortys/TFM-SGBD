const User = require("../../models/User");
const {
  handleServiceError,
  sanitizeUser,
  decrypt,
} = require("../../utils/service.util");
// Confirmer le compte utilisateur
module.exports = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) return null;
    if (user.phone) {
      user.phone = decrypt(user.phone);
    }

    user.isActive = true;
    await user.save();
    return sanitizeUser(user);
  } catch (error) {
    handleServiceError(error, "Erreur lors de la confirmation du compte", {
      service: "userService",
      operation: "confirmUserAccount",
    });
  }
};
