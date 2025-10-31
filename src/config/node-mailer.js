const nodemailer = require("nodemailer");
const logger = require("../utils/logger.util");
let transporterPromise = (async () => {
  try {
    // --- Priorité : SMTP config explicite ---
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      logger.info(
        `✉️ Mode SMTP actif → ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`
      );

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000,
      });

      // Vérifie la connexion SMTP
      await transporter.verify();
      logger.info("✉️ Connexion SMTP réussie.");
      return transporter;
    }

    // --- Fallback : Brevo ---
    else if (process.env.BREVO_API_KEY) {
      logger.info(`✉️ Mode Brevo actif → smtp-relay.brevo.com:587`);

      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: "apikey",
          pass: process.env.BREVO_API_KEY,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000,
      });

      await transporter.verify();
      logger.info("✉️ Connexion Brevo réussie.");
      return transporter;
    }

    // --- Fallback : Ethereal ---
    else {
      logger.info(`✉️ Mode développement Ethereal actif`);
      const testAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      await transporter.verify();
      logger.info("✉️ Connexion Ethereal réussie.");
      logger.info(`✉️ Compte de test → ${testAccount.user}`);
      return transporter;
    }
  } catch (error) {
    logger.error("✉️ Échec de la configuration du transporteur.");
    logger.error("Message:", error.message);
    if (error.code) logger.error("Code:", error.code);
    if (error.command) logger.error("Commande SMTP:", error.command);
    throw error;
  }
})();

module.exports = transporterPromise;
