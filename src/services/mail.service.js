const transporterPromise = require("../config/node-mailer");
const ejs = require("ejs");
const path = require("path");

// Helper pour générer le chemin d’un template
const templatePath = (file) => path.join(__dirname, "../templates", file);

// Helper générique pour rendre une vue EJS
const renderHtml = async (view, params) => {
  try {
    return await ejs.renderFile(view, params);
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors du rendu de la vue " + view);
  }
};

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
      console.error(error);
      throw new Error("Erreur lors de l'envoi du mail de bienvenue");
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
      console.error(error);
      throw new Error("Erreur lors de l'envoi du mail de récupération");
    }
  },

  newOrder: async (order, user) => {
    try {
      const transporter = await transporterPromise;
      const html = await renderHtml(templatePath("new-order.ejs"), {
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
      console.error(error);
      throw new Error(
        "Erreur lors de l'envoi du mail de création de la commande"
      );
    }
  },
};
