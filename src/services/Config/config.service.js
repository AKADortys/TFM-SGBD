const Config = require("../../models/Config");
const { handleServiceError } = require("../../utils/service.util");

module.exports = {
    // Get current config (or create default if not exists)
    getConfig: async () => {
        try {
            let config = await Config.findOne();
            if (!config) {
                // Initialize with default opening hours (e.g. all open) if creating new
                const defaultOpeningHours = [];
                for (let i = 0; i <= 6; i++) {
                    defaultOpeningHours.push({
                        dayOfWeek: i,
                        isOpen: true,
                        morning: { start: "09:00", end: "12:00" },
                        afternoon: { start: "14:00", end: "18:00" }
                    });
                }

                config = await Config.create({
                    isStoreOpen: true,
                    openingHours: defaultOpeningHours,
                    plannedClosures: []
                });
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
            if (data.openingHours) {
                // We could merge or replace. Replacing is safer to avoid inconsistencies.
                config.openingHours = data.openingHours;
            }
            if (data.plannedClosures) {
                config.plannedClosures = data.plannedClosures;
            }

            // Legacy fields - kept for now if needed, but primary logic moves to above
            if (data.reason) { config.reason = data.reason; }
            if (data.closingSchedule) { config.closingSchedule = data.closingSchedule; }

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
