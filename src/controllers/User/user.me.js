const { getUserMe } = require("../../services/user.index");
const { handleResponse } = require("../../utils/controller.util");

module.exports = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await getUserMe(id);
        if (user.message) {
            return handleResponse(res, 404, user.message);
        }
        return handleResponse(res, 200, "Utilisateur récupéré avec succès", user);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
}