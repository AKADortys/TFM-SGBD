const Config = require("../../models/Config");
const { handleServiceError } = require("../../utils/service.util");

module.exports = {
    // Get current config (or create default if not exists)
    getConfig: async () => {
        try {
            let config = await Config.findOne();
            if (!config) {
                config = await Config.create({});
            }
            return config;
        } catch (error) {
            handleServiceError(error, "Erreur lors de la récupération de la configuration", {
                service: "Config",
                operation: "getConfig",
            });
        }
    },

    // Update config
    updateConfig: async (data) => {
        try {
            let config = await Config.findOne();
            if (!config) {
                config = await Config.create({});
            }

            // Update fields
            if (typeof data.isStoreOpen !== "undefined") {
                config.isStoreOpen = data.isStoreOpen;
            }
            if (data.closingSchedule) {
                config.closingSchedule = data.closingSchedule;
            }
            if (typeof data.reason !== "undefined") {
                config.reason = data.reason;
            }

            await config.save();
            return config;
        } catch (error) {
            handleServiceError(error, "Erreur lors de la mise à jour de la configuration", {
                service: "Config",
                operation: "updateConfig",
            });
        }
    },
};
