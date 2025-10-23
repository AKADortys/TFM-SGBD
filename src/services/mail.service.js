const transporterPromise = require("../config/node-mailer");

const {
  handleServiceError,
  renderHtml,
  templatePath,
} = require("../utils/service.util");

module.exports = {
  // Fonction d'envoi du mail de bienvenue
  welcomeMail: async (user, token) => {
    try {
      const transporter = await transporterPromise;
      const html = await renderHtml(templatePath("welcome.ejs"), {
        user,
        loginUrl: process.env.FRONT_ACCOUNT_CONFIRM_URL + "?token=",
        title: "Bienvenue Au Ptit Vivo",
        token,
      });

      await transporter.sendMail({
        from: '"Au Ptit Vivo" <no-reply@example.com>',
        to: user.mail,
        subject: "Bienvenue chez Au Ptit Vivo",
        html,
      });
    } catch (error) {
      handleServiceError(error, "Erreur lors de l'envoi du mail de bienvenue", {
        service: "mailService",
        operation: "welcomeMail",
      });
    }
  },
  // Fonction d'envoi du mail de réinitialisation de mot de passe
  passReset: async (user, token) => {
    try {
      const transporter = await transporterPromise;
      const html = await renderHtml(templatePath("pass-reset.ejs"), {
        title: "Récupération de votre mot de passe",
        user,
        token,
        url: process.env.FRONT_PASSWORD_RESET_URL + "?token=",
      });

      await transporter.sendMail({
        from: '"Au Ptit Vivo" <no-reply@example.com>',
        to: user.mail,
        subject: "Récupération de votre mot de passe",
        html,
      });
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de l'envoi du mail de récupération",
        { service: "mailService", operation: "passReset" }
      );
    }
  },
  // Fonction d'envoi du mail de nouvelle commande
  newOrder: async (order, user) => {
    try {
      const transporter = await transporterPromise;
      const htmlClient = await renderHtml(templatePath("new-order.ejs"), {
        title: "Votre commande est en cours de traitement !",
        order,
        user,
        url_profil: process.env.FRONT_BASE_URL + "/profile",
      });
      await transporter.sendMail({
        from: '"Au Ptit Vivo" <no-reply@example.com>',
        to: user.mail,
        subject: "Confirmation de votre commande - Au Ptit Vivo",
        html: htmlClient,
      });
      const htmlAdmin = await renderHtml(templatePath("admin-new-order.ejs"), {
        title: "Nouvelle commande reçue",
        order,
        user,
        url_admin: process.env.FRONT_BASE_URL + "/admin",
      });
      await transporter.sendMail({
        from: '"Au Ptit Vivo" <no-reply@example.com>',
        to: process.env.ADMIN_MAIL,
        subject: `Nouvelle commande de ${user.fullname} - Au Ptit Vivo`,
        html: htmlAdmin,
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
