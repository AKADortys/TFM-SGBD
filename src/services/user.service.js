const User = require("../models/User");
const {
  handleServiceError,
  paginatedQuery,
  sanitizeUser,
} = require("../utils/service.util");

const userService = {
  // Récupérer tous les utilisateurs
  getUsers: async (askPage, limit, searchTerm = "") => {
    try {
      // Construction de la condition de recherche
      const searchQuery = searchTerm
        ? {
            $or: [
              { name: { $regex: searchTerm, $options: "i" } },
              { lastName: { $regex: searchTerm, $options: "i" } },
            ],
          }
        : {};
      const { items, total, totalPages, page } = await paginatedQuery(
        User,
        searchQuery,
        askPage,
        limit
      );
      return { users: items.map(sanitizeUser), total, totalPages, page };
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération des utilisateurs"
      );
    }
  },
  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    try {
      const user = await User.findById(id);
      return sanitizeUser(user) || null;
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération de l'utilisateur"
      );
    }
  },
  // Récupérer un utilisateur par email
  getUserByMail: async (mail) => {
    try {
      const user = await User.findOne({ mail });
      return user || null;
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération de l'utilisateur"
      );
    }
  },
  // Créer un nouvel utilisateur
  createUser: async (value) => {
    try {
      const user = new User(value);
      await user.save();
      return sanitizeUser(user);
    } catch (error) {
      handleServiceError(error, "Erreur lors de la création de l'utilisateur");
    }
  },
  updateUser: async (id, updateFields) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) return null;
      return sanitizeUser(updatedUser);
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la mise à jour de l'utilisateur"
      );
    }
  },
  updateUserPassword: async (id, newPassword) => {
    try {
      const user = await User.findById(id);
      if (!user) return null;

      user.password = newPassword;
      await user.save();
      return sanitizeUser(user);
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la mise à jour du mot de passe de l'utilisateur"
      );
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
      handleServiceError(
        error,
        "Erreur lors de la suppression de l'utilisateur"
      );
    }
  },
  confirmUserAccount: async (id) => {
    try {
      const user = await User.findById(id);
      if (!user) return null;

      user.isActive = true;
      await user.save();
      return sanitizeUser(user);
    } catch (error) {
      handleServiceError(error, "Erreur lors de la confirmation du compte");
    }
  },
};
module.exports = userService;
