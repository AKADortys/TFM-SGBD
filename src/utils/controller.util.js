const validator = require("validator");
const { ObjectId } = require("mongodb");
const logger = require("./logger.util");
module.exports = {
  // Validation d'email
  validateEmail(email) {
    if (typeof email !== "string" || !validator.isEmail(email)) {
      return "L'email fourni est invalide";
    }
    return null;
  },
  // Validation de mot de passe
  validatePassword(password) {
    if (
      typeof password !== "string" ||
      !validator.isLength(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return "Le mot de passe doit faire au moins 8 caractères et contenir au moins une majuscule, une minuscule et un chiffre";
    }
    return null;
  },
  // Options pour les cookies
  cookieOptions: (maxAge) => ({
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge,
  }),
  // Création du payload pour les tokens
  createTokenPayload: (user) => ({
    id: user._id,
    role: user.role,
    fullname: `${user.name} ${user.lastName}`,
    mail: user.mail,
  }),
  // Validation d'un ObjectId MongoDB
  isObjectId: (id) => {
    if (!ObjectId.isValid(id)) {
      return "ID invalide";
    }
    return null;
  },
  // Gestion des réponses standardisées
  handleResponse: (res, status, message, data = null) => {
    const payload = { success: status >= 200 && status < 300, message };
    if (data !== null) payload.data = data;
    logger.info(`Response ${status}: ${message}`);
    return res.status(status).json(payload);
  },
  // Vérifie si le magasin est ouvert selon la configuration
  checkIfStoreIsOpen: (config) => {
    const now = new Date();

    // 1. Fermeture manuelle
    if (!config.isStoreOpen) {
      return { isOpen: false, reason: config.reason || "Le magasin est actuellement fermé (Fermeture Manuelle)." };
    }

    // 2. fermeture plkannifiées
    if (config.plannedClosures && config.plannedClosures.length > 0) {
      const activeClosure = config.plannedClosures.find((closure) => {
        const start = new Date(closure.start);
        const end = new Date(closure.end);
        return now >= start && now <= end;
      });

      if (activeClosure) {
        return { isOpen: false, reason: activeClosure.reason || "Le magasin est fermé pour une période exceptionnelle." };
      }
    }

    // 3. Heures d'ouvertures
    if (config.openingHours && config.openingHours.length > 0) {
      const timeZone = 'Europe/Paris'; // Fuseau horaire du restaurant
      
      const daysMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
      const currentDayStr = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(now);
      const currentDay = daysMap[currentDayStr];

      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      
      const parts = formatter.formatToParts(now);
      const partsObj = {};
      parts.forEach(({ type, value }) => { partsObj[type] = value; });
      const currentTimeMinutes = parseInt(partsObj.hour, 10) * 60 + parseInt(partsObj.minute, 10);

      const todayConfig = config.openingHours.find(
        (day) => day.dayOfWeek === currentDay,
      );

      if (!todayConfig || !todayConfig.isOpen) {
        return { isOpen: false, reason: "Le magasin est fermé aujourd'hui." };
      }

      // helper formatage date en minutes
      const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const morningStart = timeToMinutes(todayConfig.morning.start);
      const morningEnd = timeToMinutes(todayConfig.morning.end);
      const afternoonStart = timeToMinutes(todayConfig.afternoon.start);
      const afternoonEnd = timeToMinutes(todayConfig.afternoon.end);

      const isMorningOpen = currentTimeMinutes >= morningStart && currentTimeMinutes <= morningEnd;
      const isAfternoonOpen = currentTimeMinutes >= afternoonStart && currentTimeMinutes <= afternoonEnd;

      if (!isMorningOpen && !isAfternoonOpen) {
        return { isOpen: false, reason: "Le magasin est fermé à cette heure-ci." };
      }
    }

    return { isOpen: true };
  },
  // Calcul de la distance via la formule Haversine
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Rayon de la terre en mètres
    const P = Math.PI / 180;
    const a =
      0.5 -
      Math.cos((lat2 - lat1) * P) / 2 +
      (Math.cos(lat1 * P) *
        Math.cos(lat2 * P) *
        (1 - Math.cos((lon2 - lon1) * P))) /
        2;
    return R * 2 * Math.asin(Math.sqrt(a));
  },
};

