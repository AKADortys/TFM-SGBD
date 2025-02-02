const userService = require("../services/user.service");
const validator = require("validator");

const userController = {
  // Récupération de tous les utilisateurs
  getUsers: async (req, res) => {
    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Récupération d'un utilisateur par ID
  getUserById: async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  createUser: async (req, res) => {
    const { name, lastName, phone, mail, password } = req.body;

    // Vérification manuelle des champs
    if (!name || !lastName || !phone || !mail || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    if (!validator.isEmail(mail)) {
      return res.status(400).json({ message: "L'email fourni est invalide" });
    }

    if (!validator.isMobilePhone(phone, "fr-FR")) {
      return res.status(400).json({ message: "Numéro de téléphone invalide" });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre",
      });
    }

    try {
      const existingUser = await userService.getUserByMail(mail);
      if (existingUser) {
        return res.status(400).json({ message: "Email déjà utilisé !" });
      }

      const newUser = await userService.createUser({
        name,
        lastName,
        phone,
        mail,
        password,
      });

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  // Modification d'un utilisateur
  updateUser: async (req, res) => {
    const { name, lastName, phone, mail } = req.body;

    try {
      // Récupération de l'utilisateur existant
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable !" });
      }

      // Validation des entrées avant mise à jour
      const updateFields = {};

      if (name) {
        if (name.length < 2 || name.length > 50) {
          return res
            .status(400)
            .json({
              message: "Le prénom doit contenir entre 2 et 50 caractères",
            });
        }
        updateFields.name = name.trim();
      }

      if (lastName) {
        if (lastName.length < 2 || lastName.length > 50) {
          return res
            .status(400)
            .json({
              message:
                "Le nom de famille doit contenir entre 2 et 50 caractères",
            });
        }
        updateFields.lastName = lastName.trim();
      }

      if (mail) {
        if (!validator.isEmail(mail)) {
          return res
            .status(400)
            .json({ message: "L'email fourni est invalide" });
        }
        updateFields.mail = mail.toLowerCase().trim();
      }

      if (phone) {
        if (!validator.isMobilePhone(phone, "fr-FR")) {
          return res
            .status(400)
            .json({ message: "Numéro de téléphone invalide" });
        }
        updateFields.phone = phone.trim();
      }

      // Mise à jour de l'utilisateur
      const updatedUser = await userService.updateUser(
        req.params.id,
        updateFields
      );

      if (!updatedUser) {
        return res
          .status(400)
          .json({ message: "Échec de la mise à jour de l'utilisateur" });
      }

      res.json({
        message: "Utilisateur modifié avec succès !",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  // Suppression d'un utilisateur
  deleteUser: async (req, res) => {
    try {
      await userService.deleteUser(req.params.id);
      res.json({ message: "Utilisateur supprimé avec succès !" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};

module.exports = userController;
