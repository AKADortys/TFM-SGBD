const User = require("../../models/User");
const { sanitizeUser, handleServiceError } = require("../../utils/service.util");

module.exports = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return { message: "Utilisateur non trouvé" };
        }
        return sanitizeUser(user);
    } catch (error) {
        return handleServiceError(error, "Erreur lors de la récupération de l'utilisateur", {});
    }
};
