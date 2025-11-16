const mailer = require("@getbrevo/brevo");
const logger = require("../utils/logger.util");

const apiInstance = new mailer.TransactionalEmailsApi();
apiInstance.setApiKey(
  mailer.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

module.exports = {
  send: async (params) => {
    try {
      const response = await apiInstance.sendTransacEmail(params);
      logger.info(`✉️ Email envoyé → ${params.to[0].email}`);
      return response;
    } catch (err) {
      logger.error("❌ Erreur envoi mail via Brevo API");
      throw err;
    }
  },
};
