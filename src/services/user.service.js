const User = require("../models/User");
const {
  handleServiceError,
  paginatedQuery,
  sanitizeUser,
  decrypt,
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
      const users = items.map((user) => {
        const cleanUser = sanitizeUser(user);
        if (cleanUser.phone) {
          cleanUser.phone = decrypt(cleanUser.phone);
        }
        return cleanUser;
      });
      return { users, total, totalPages, page };
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération des utilisateurs",
        { service: "userService", operation: "getUsers" }
      );
    }
  },
  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    try {
      const user = await User.findById(id);
      if (user && user.phone) {
        user.phone = decrypt(user.phone);
      }
      return sanitizeUser(user) || null;
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération de l'utilisateur",
        { service: "userService", operation: "getUserById" }
      );
    }
  },
  // Récupérer un utilisateur par email
  getUserByMail: async (mail) => {
    try {
      const user = await User.findOne({ mail });
      if (user && user.phone) {
        user.phone = decrypt(user.phone);
      }
      return user || null;
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la récupération de l'utilisateur",
        { service: "userService", operation: "getUserByMail" }
      );
    }
  },
  // Créer un nouvel utilisateur
  createUser: async (value) => {
    try {
      const user = new User(value);
      await user.save();
      if (user.phone) {
        user.phone = decrypt(user.phone);
      }
      return sanitizeUser(user);
    } catch (error) {
      handleServiceError(error, "Erreur lors de la création de l'utilisateur", {
        service: "userService",
        operation: "createUser",
      });
    }
  },
  // Mettre à jour un utilisateur
  updateUser: async (id, updateFields) => {
    try {
      const updatedUser = await User.findById(id);
      if (!updatedUser) return null;
      Object.assign(updatedUser, updateFields);
      await updatedUser.save();
      if (updatedUser.phone) {
        updatedUser.phone = decrypt(updatedUser.phone);
      }
      return sanitizeUser(updatedUser);
    } catch (error) {
      handleServiceError(
        error,
        "Erreur lors de la mise à jour de l'utilisateur",
        {
          service: "userService",
          operation: "updateUser",
        }
      );
    }
  },
  // Mettre à jour le mot de passe d'un utilisateur
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
        "Erreur lors de la mise à jour du mot de passe de l'utilisateur",
        { service: "userService", operation: "updateUserPassword" }
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
        "Erreur lors de la suppression de l'utilisateur",
        { service: "userService", operation: "deleteUser" }
      );
    }
  },
  // Confirmer le compte utilisateur
  confirmUserAccount: async (id) => {
    try {
      const user = await User.findById(id);
      if (!user) return null;
      if (user.phone) {
        user.phone = decrypt(user.phone);
      }

      user.isActive = true;
      await user.save();
      return sanitizeUser(user);
    } catch (error) {
      handleServiceError(error, "Erreur lors de la confirmation du compte", {
        service: "userService",
        operation: "confirmUserAccount",
      });
    }
  },
};
module.exports = userService;
