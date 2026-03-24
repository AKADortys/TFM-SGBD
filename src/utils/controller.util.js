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
    const payload = { message };
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
      const currentDay = now.getDay(); // 0 (Dimanche) - 6 (Samedi)
      const todayConfig = config.openingHours.find(
        (day) => day.dayOfWeek === currentDay,
      );

      if (!todayConfig || !todayConfig.isOpen) {
        return { isOpen: false, reason: "Le magasin est fermé aujourd'hui." };
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
        return { isOpen: false, reason: "Le magasin est fermé à cette heure-ci." };
      }
    }

    return { isOpen: true };
  },
};
