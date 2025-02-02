const User = require("../models/User");

const userController = {
  // Récupération de tous les utilisateurs
  getUsers: async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur server" });
    }
  },

  // Création d'un utilisateur
  createUser: async (req, res) => {
    const { name, lastName, phone, mail, password } = req.body;

    try {
      // Vérification si l'utilisateur existe déjà
      const existingUser = await User.findOne({ mail });
      if (existingUser) {
        return res.status(400).json({ message: "Email déjà utilisé !" });
      }

      // Création de l'utilisateur
      const newUser = await User.create({
        name,
        lastName,
        phone,
        mail,
        password,
      });

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Récupération d'un utilisateur par son ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable !" });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur server" });
    }
  },

  // Modification d'un utilisateur
  updateUser: async (req, res) => {
    const { name, lastName, phone, mail } = req.body;

    try {
      // Vérifier si l'utilisateur existe
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable !" });
      }

      // Mettre à jour les champs fournis
      user.name = name || user.name;
      user.lastName = lastName || user.lastName;
      user.phone = phone || user.phone;
      user.mail = mail || user.mail;

      const updatedUser = await user.save();
      res.json({
        message: "Utilisateur modifié avec succès !",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur server" });
    }
  },

  // Suppression d'un utilisateur
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      await User.deleteOne({ _id: req.params.id });
      res.json({ message: "Utilisateur supprimé avec succès !" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur server" });
    }
  },
};

module.exports = userController;
