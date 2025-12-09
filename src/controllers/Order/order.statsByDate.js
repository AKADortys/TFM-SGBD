const { statsByDate } = require("../../services/orders.index");
const { handleResponse } = require("../../utils/controller.util");

module.exports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await statsByDate(startDate, endDate);
    handleResponse(res, 200, "Statistiques commandes par date", stats);
  } catch (error) {
    handleResponse(res, 500, "Erreur serveur");
  }
};
