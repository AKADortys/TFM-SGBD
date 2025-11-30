const User = require("../../models/User");
const {
  handleServiceError,
  sanitizeUser,
  decrypt,
} = require("../../utils/service.util");
// Mettre à jour un utilisateur
module.exports = async (id, updateFields) => {
  try {
    const updatedUser = await User.findById(id);
    if (!updatedUser) return null;
    updatedUser.phone = decrypt(updatedUser.phone);
    Object.assign(updatedUser, updateFields);
    await updatedUser.save();
    if (updatedUser.phone) {
      updatedUser.phone = decrypt(updatedUser.phone);
    }
    return sanitizeUser(updatedUser);
  } catch (error) {
    handleServiceError(
      error,
      "Erreur lors de la mise à jour de l'utilisateur",
      {
        service: "userService",
        operation: "updateUser",
      }
    );
  }
};
