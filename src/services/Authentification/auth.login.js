const bcrypt = require("bcrypt");
const { getUserByMail } = require("../User/user.service");
const {
  sanitizeUser,
  handleServiceError,
} = require("../../utils/service.util");
// Fonction de connexion
module.exports = async (email, password) => {
  try {
    const user = await getUserByMail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return sanitizeUser(user);
  } catch (error) {
    handleServiceError(error, "Erreur lors de la connexion", {
      service: "authService",
      operation: "login",
    });
  }
};
