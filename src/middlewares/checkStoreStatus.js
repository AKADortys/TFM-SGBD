const configService = require("../services/Config/config.service");
const { handleResponse } = require("../utils/controller.util");

module.exports = async (req, res, next) => {
  try {
    const config = await configService.getConfig();
    const now = new Date();

    // 1. Fermeture manuelle
    if (!config.isStoreOpen) {
      return handleResponse(
        res,
        503,
        config.reason ||
          "Le magasin est actuellement fermé (Fermeture Manuelle).",
      );
    }

    // 2. fermeture plkannifiées
    if (config.plannedClosures && config.plannedClosures.length > 0) {
      const activeClosure = config.plannedClosures.find((closure) => {
        const start = new Date(closure.start);
        const end = new Date(closure.end);
        return now >= start && now <= end;
      });

      if (activeClosure) {
        return handleResponse(
          res,
          503,
          activeClosure.reason ||
            "Le magasin est fermé pour une période exceptionnelle.",
        );
      }
    }

    // 3. Heures d'ouvertures
    if (config.openingHours && config.openingHours.length > 0) {
      const currentDay = now.getDay(); // 0 (Dimanche) - 6 (Samedi)
      const todayConfig = config.openingHours.find(
        (day) => day.dayOfWeek === currentDay,
      );

      if (!todayConfig || !todayConfig.isOpen) {
        return handleResponse(res, 503, "Le magasin est fermé aujourd'hui.");
      }

      // helper formatage date
      const parseTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date(now);
        date.setHours(hours, minutes, 0, 0);
        return date;
      };

      const morningStart = parseTime(todayConfig.morning.start);
      const morningEnd = parseTime(todayConfig.morning.end);
      const afternoonStart = parseTime(todayConfig.afternoon.start);
      const afternoonEnd = parseTime(todayConfig.afternoon.end);

      const isMorningOpen = now >= morningStart && now <= morningEnd;
      const isAfternoonOpen = now >= afternoonStart && now <= afternoonEnd;

      if (!isMorningOpen && !isAfternoonOpen) {
        return handleResponse(
          res,
          503,
          "Le magasin est fermé à cette heure-ci.",
        );
      }
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
