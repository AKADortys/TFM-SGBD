const transporterPromise = require("../config/node-mailer");

const {
  handleServiceError,
  renderHtml,
  templatePath,
} = require("../utils/service.util");

module.exports = {
  welcomeMail: async (user) => {
    try {
      const transporter = await transporterPromise;
      const html = await renderHtml(templatePath("welcome.ejs"), {
        user,
        loginUrl: "https://google.com/",
        title: "Bienvenue Au Ptit Vivo",
      });

      await transporter.sendMail({
        from: '"Au Ptit Vivo" <no-reply@example.com>',
        to: user.mail,
        subject: "Bienvenue chez Au Ptit Vivo",
        html,
      });
    } catch (error) {
      handleServiceError(error, "Erreur lors de l'envoi du mail de bienvenue");
    }
  },

  passReset: async (user, token) => {
    try {
      const transporter = await transporterPromise;
      const html = await renderHtml(templatePath("pass-reset.ejs"), {
        title: "Récupération de votre mot de passe",
        user,
        token,
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
        "Erreur lors de l'envoi du mail de récupération"
      );
    }
  },

  newOrder: async (order, user) => {
    try {
      const transporter = await transporterPromise;
      let html = await renderHtml(templatePath("new-order.ejs"), {
        title: "Votre commande est en cour de traitement !",
        order: order,
        user: user,
      });
      await transporter.sendMail({
        from: '"Au Ptit Vivo" <no-reply@example.com>',
        to: user.mail,
        subject: "Confirmation de votre commande - Au Ptit Vivo",
        html,
      });
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de l'envoi du mail de création de la commande"
      );
    }
  },
};
