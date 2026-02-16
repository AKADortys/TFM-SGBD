const User = require("../../models/User");
const { sanitizeUser, decrypt, handleServiceError } = require("../../utils/service.util");

module.exports = async (id) => {
    try {
        const user = await User.findById(id);
        user.phone = decrypt(user.phone);
        if (!user) {
            return { message: "Utilisateur non trouvé" };
        }
        return sanitizeUser(user);
    } catch (error) {
        return handleServiceError(error, "Erreur lors de la récupération de l'utilisateur", {});
    }
};
