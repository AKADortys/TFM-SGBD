const configService = require("../services/Config/config.service");
const { handleResponse } = require("../utils/controller.util");

module.exports = async (req, res, next) => {
    try {
        const config = await configService.getConfig();

        // Check manual close
        if (!config.isStoreOpen) {
            return handleResponse(res, 503, config.reason || "Le magasin est actuellement fermé.");
        }

        // Check schedule
        if (config.closingSchedule && config.closingSchedule.start && config.closingSchedule.end) {
            const now = new Date();
            const start = new Date(config.closingSchedule.start);
            const end = new Date(config.closingSchedule.end);

            if (now >= start && now <= end) {
                return handleResponse(res, 503, config.reason || "Le magasin est fermé selon les horaires définis.");
            }
        }

        next();
    } catch (error) {
        return handleResponse(res, 500, "Erreur lors de la vérification du statut du magasin.");
    }
};
