const { generalStats } = require("../../services/orders.index");
const { handleResponse } = require("../../utils/controller.util");

module.exports = async (req, res) => {
  try {
    const stats = await generalStats();
    handleResponse(res, 200, "Statistiques générales commandes", stats);
  } catch (error) {
    handleResponse(res, 500, "Erreur serveur");
  }
};
