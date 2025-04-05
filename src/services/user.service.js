const User = require("../models/User");

const userService = {
  // Récupérer tous les utilisateurs
  getUsers: async (page, limit) => {
    try {
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find().skip(skip).limit(limit),
        User.countDocuments(),
      ]);
      return {
        users,
        total,
        totalPages: Math.ceil(total / limit),
        page,
      };
    } catch (error) {
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
  },
  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    try {
      const user = await User.findById(id);
      if (!user) return null;
      return user;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  },
  // Récupérer un utilisateur par email
  getUserByMail: async (mail) => {
    try {
      const user = await User.findOne({ mail });
      if (!user) return null;
      return user;
    } catch (error) {
      console.error("Erreur lors de la récupération de user", error);
      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  },
  // Créer un nouvel utilisateur
  createUser: async (value) => {
    try {
      const user = new User(value);
      await user.save();
      return user;
    } catch (error) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  },
  updateUser: async (id, updateFields) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) return null;

      const response = { ...updatedUser._doc };

      delete response.password;
      return response;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:");
      throw error;
    }
  },
  // Supprimer un utilisateur
  deleteUser: async (id) => {
    try {
      const user = await User.findById(id);
      if (!user) return null;

      await User.deleteOne({ _id: id });
      return true;
    } catch (error) {
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
  },
};
module.exports = userService;
