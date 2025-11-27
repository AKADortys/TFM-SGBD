const { getUsers } = require("../../services/user.service");
const { handleResponse } = require("../../utils/controller.util");
// Récupération de tous les utilisateurs
module.exports = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getUsers(page, limit, search);

    return handleResponse(
      res,
      200,
      "utilisateurs récupérés avec succès",
      result
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs:",
      error.message
    );
    return handleResponse(res, 500, error.message);
  }
};
