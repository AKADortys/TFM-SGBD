const { generalStats } = require("../../services/user.index");
const { handleResponse } = require("../../utils/controller.util");

module.exports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await generalStats(startDate, endDate);
    handleResponse(res, 200, "Statistiques utilisateurs générales", stats);
  } catch (err) {
    handleResponse(res, 500, { error: err.message });
  }
};
