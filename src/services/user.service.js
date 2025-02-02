const User = require("../models/User");

const userService = {
  // Récupérer tous les utilisateurs
  getUsers: async () => {
    try {
      return await User.find({});
    } catch (error) {
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    try {
      const user = await User.findById(id);
      if (!user) throw new Error("Utilisateur introuvable");
      return user;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  },

  // Récupérer un utilisateur par email
  getUserByMail: async (mail) => {
    try {
      return await User.findOne({ mail });
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  },

  // Créer un nouvel utilisateur
  createUser: async ({ name, lastName, phone, mail, password }) => {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ mail });
      if (existingUser) throw new Error("Email déjà utilisé !");

      // Création de l'utilisateur
      return await User.create({ name, lastName, phone, mail, password });
    } catch (error) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id, updateData) => {
    try {
      const user = await User.findById(id);
      if (!user) throw new Error("Utilisateur introuvable");

      // Mise à jour des champs fournis
      Object.assign(user, updateData);
      return await user.save();
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour de l'utilisateur");
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    try {
      const user = await User.findById(id);
      if (!user) throw new Error("Utilisateur introuvable");

      await User.deleteOne({ _id: id });
      return true;
    } catch (error) {
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
  },
};

module.exports = userService;
