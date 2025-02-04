const userService = require("../services/user.service");
const validator = require("validator");
const { ObjectId } = require("mongodb");

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
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // Création d'un utilisateur
  createUser: async (req, res) => {
    let { name, lastName, phone, mail, password } = req.body;
    let errors = [];

    // Vérification des champs requis
    if (!name || !lastName || !phone || !mail || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Normalisation des données
    mail = validator.normalizeEmail(mail);

    // Validation du prénom
    if (
      !validator.isLength(name, { min: 2, max: 50 }) ||
      !validator.isAlpha(name, "fr-FR", { ignore: " -" })
    ) {
      errors.push(
        "Le prénom doit contenir entre 2 et 50 caractères et ne doit contenir que des lettres."
      );
    }

    // Validation du nom de famille
    if (
      !validator.isLength(lastName, { min: 2, max: 50 }) ||
      !validator.isAlpha(lastName, "fr-FR", { ignore: " -" })
    ) {
      errors.push(
        "Le nom de famille doit contenir entre 2 et 50 caractères et ne doit contenir que des lettres."
      );
    }

    // Validation de l'email
    if (!validator.isEmail(mail)) {
      errors.push("L'email fourni est invalide.");
    }

    // Validation du téléphone
    if (!validator.isMobilePhone(phone, "fr-FR")) {
      errors.push("Numéro de téléphone invalide.");
    }

    // Validation du mot de passe
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      errors.push(
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre."
      );
    }

    // Retourner toutes les erreurs si présentes
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    try {
      const existingUser = await userService.getUserByMail(mail);
      if (existingUser) {
        return res.status(400).json({ message: "Email déjà utilisé !" });
      }

      const newUser = await userService.createUser({
        name: name.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        mail,
        password,
      });

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur " + error.message });
    }
  },

  // Modification d'un utilisateur
  updateUser: async (req, res) => {
    let { name, lastName, phone, mail, password } = req.body;
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    try {
      // Vérification de l'existence de l'utilisateur
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable !" });
      }

      // Validation des champs à mettre à jour
      const updateFields = {};

      if (name) {
        if (
          !validator.isLength(name, { min: 2, max: 50 }) ||
          !validator.isAlpha(name, "fr-FR", { ignore: " -" })
        ) {
          return res.status(400).json({
            message:
              "Le prénom doit contenir entre 2 et 50 caractères et uniquement des lettres",
          });
        }
        updateFields.name = name.trim();
      }

      if (lastName) {
        if (
          !validator.isLength(lastName, { min: 2, max: 50 }) ||
          !validator.isAlpha(lastName, "fr-FR", { ignore: " -" })
        ) {
          return res.status(400).json({
            message:
              "Le nom de famille doit contenir entre 2 et 50 caractères et uniquement des lettres",
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

      if (password) {
        if (
          !validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
          })
        ) {
          return res.status(400).json({
            message:
              "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
          });
        }
        updateFields.password = password;
      }

      // Mise à jour de l'utilisateur
      const updatedUser = await userService.updateUser(id, updateFields);

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
      res.status(500).json({ message: "Erreur serveur " + error.message });
    }
  },

  // Suppression d'un utilisateur
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      await userService.deleteUser(id);
      res.json({ message: "Utilisateur supprimé avec succès !" }).status(200)
        .json;
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};

module.exports = userController;
