const mailer = require("@getbrevo/brevo");
const logger = require("../utils/logger.util");

// Dans la v3, on instancie le client global avec la config
const client = new mailer.BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

module.exports = {
  send: async (params) => {
    try {
      /**
       * Dans la v3, les APIs sont des propriétés du client.
       * TransactionalEmailsApi devient -> client.transactionalEmails
       */
      const response =
        await client.transactionalEmails.sendTransacEmail(params);

      logger.info(`✉️ Email envoyé → ${params.to[0].email}`);
      return response;
    } catch (err) {
      logger.error("❌ Erreur envoi mail via Brevo API v3");

      if (err.statusCode) {
        console.error(`Erreur API (${err.statusCode}):`, err.body);
      } else {
        console.error(err);
      }
      throw err;
    }
  },
};
