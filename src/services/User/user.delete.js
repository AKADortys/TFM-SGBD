const User = require("../../models/User");
const { handleServiceError } = require("../../utils/service.util");
// Supprimer un utilisateur
module.exports = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) return null;

    await User.deleteOne({ _id: id });
    return true;
  } catch (error) {
    handleServiceError(
      error,
      "Erreur lors de la suppression de l'utilisateur",
      { service: "userService", operation: "deleteUser" }
    );
  }
};
