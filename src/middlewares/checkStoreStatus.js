const configService = require("../services/Config/config.service");
const { handleResponse, checkIfStoreIsOpen } = require("../utils/controller.util");

module.exports = async (req, res, next) => {
  try {
    const config = await configService.getConfig();
    const status = checkIfStoreIsOpen(config);

    if (!status.isOpen) {
      return handleResponse(res, 503, status.reason);
    }

    next();
  } catch (error) {
    console.error("Store status check error:", error);
    return handleResponse(
      res,
      500,
      "Erreur lors de la vérification du statut du magasin.",
    );
  }
};
