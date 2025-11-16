const brevoApi = require("../config/brevoApi");
const {
  handleServiceError,
  renderHtml,
  templatePath,
} = require("../utils/service.util");

module.exports = {
  // Mail de bienvenue
  welcomeMail: async (user, token) => {
    try {
      const html = await renderHtml(templatePath("welcome.ejs"), {
        user,
        loginUrl: process.env.FRONT_ACCOUNT_CONFIRM_URL + "/",
        title: "Bienvenue Au Ptit Vivo",
        token,
      });

      await brevoApi.send({
        sender: { email: process.env.ADMIN_MAIL, name: "Au Ptit Vivo" },
        to: [{ email: user.mail }],
        subject: "Bienvenue chez Au Ptit Vivo",
        htmlContent: html,
      });
    } catch (error) {
      handleServiceError(error, "Erreur lors de l'envoi du mail de bienvenue", {
        service: "mailService",
        operation: "welcomeMail",
      });
    }
  },

  // Mail de récupération de mot de passe
  passReset: async (user, token) => {
    try {
      const html = await renderHtml(templatePath("pass-reset.ejs"), {
        title: "Récupération de votre mot de passe",
        user,
        token,
        url: process.env.FRONT_PASSWORD_RESET_URL + "?token=",
      });

      await brevoApi.send({
        sender: { email: process.env.ADMIN_MAIL, name: "Au Ptit Vivo" },
        to: [{ email: user.mail }],
        subject: "Récupération de votre mot de passe",
        htmlContent: html,
      });
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de l'envoi du mail de récupération",
        { service: "mailService", operation: "passReset" }
      );
    }
  },

  // Mail pour nouvelle commande (client + admin)
  newOrder: async (order, user) => {
    try {
      // Mail pour le client
      const htmlClient = await renderHtml(templatePath("new-order.ejs"), {
        title: "Votre commande est en cours de traitement !",
        order,
        user,
        url_profil: process.env.FRONT_BASE_URL + "/profile",
      });

      await brevoApi.send({
        sender: { email: process.env.ADMIN_MAIL, name: "Au Ptit Vivo" },
        to: [{ email: user.mail }],
        subject: "Confirmation de votre commande - Au Ptit Vivo",
        htmlContent: htmlClient,
      });

      // Mail pour l’admin
      const htmlAdmin = await renderHtml(templatePath("admin-new-order.ejs"), {
        title: "Nouvelle commande reçue",
        order,
        user,
        url_admin: process.env.FRONT_BASE_URL + "/admin",
      });

      await brevoApi.send({
        sender: { email: process.env.ADMIN_MAIL, name: "Au Ptit Vivo" },
        to: [{ email: process.env.ADMIN_MAIL }],
        subject: `Nouvelle commande de ${user.fullname} - Au Ptit Vivo`,
        htmlContent: htmlAdmin,
      });
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de l'envoi du mail de création de la commande",
        { service: "mailService", operation: "newOrder" }
      );
    }
  },
};
