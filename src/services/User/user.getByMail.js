const User = require("../../models/User");
const { handleServiceError, decrypt } = require("../../utils/service.util");
// Récupérer un utilisateur par email
module.exports = async (mail) => {
  try {
    const user = await User.findOne({ mail });
    if (user && user.phone) {
      user.phone = decrypt(user.phone);
    }
    return user || null;
  } catch (error) {
    handleServiceError(
      error,
      "Erreur lors de la récupération de l'utilisateur",
      { service: "userService", operation: "getUserByMail" }
    );
  }
};
