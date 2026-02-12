const Config = require("../../models/Config");
const { handleServiceError } = require("../../utils/service.util");

module.exports = {
  // Récuperer la config app, ou la créer
  getConfig: async () => {
    try {
      let config = await Config.findOne();
      if (!config) {
        // si inexistant, init un model de base
        const defaultOpeningHours = [];
        for (let i = 0; i <= 6; i++) {
          defaultOpeningHours.push({
            dayOfWeek: i,
            isOpen: true,
            morning: { start: "09:00", end: "12:00" },
            afternoon: { start: "14:00", end: "18:00" },
          });
        }

        config = await Config.create({
          isStoreOpen: true,
          openingHours: defaultOpeningHours,
          plannedClosures: [],
        });
      }
      return config;
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération de la configuration",
        {
          service: "Config",
          operation: "getConfig",
        },
      );
    }
  },

  // Update config
  updateConfig: async (data) => {
    try {
      let config = await Config.findOne();
      if (!config) {
        config = await Config.create({});
      }

      // Update des champs
      if (typeof data.isStoreOpen !== "undefined") {
        config.isStoreOpen = data.isStoreOpen;
      }
      if (data.openingHours) {
        // merge possible mais plus sur avec cette méthode
        config.openingHours = data.openingHours;
      }
      if (data.plannedClosures) {
        config.plannedClosures = data.plannedClosures;
      }

      await config.save();
      return config;
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la mise à jour de la configuration",
        {
          service: "Config",
          operation: "updateConfig",
        },
      );
    }
  },
};
