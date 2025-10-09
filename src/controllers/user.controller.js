const userService = require("../services/user.service");
const { userSchema, updateUserSchema } = require("../dto/user.dto");
const mailService = require("../services/mail.service");
const { isObjectId, handleResponse } = require("../utils/controller.util");
const userController = {
  // Récupération de tous les utilisateurs
  getUsers: async (req, res) => {
    try {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await userService.getUsers(page, limit, search);

      return handleResponse(res, 200, result);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      return handleResponse(res, 500, { message: error.message });
    }
  },
  // Récupération d'un utilisateur par ID
  getUserById: async (req, res) => {
    try {
      const id = req.params.id;
      if (isObjectId(id)) {
        return handleResponse(res, 400, { message: "ID invalide" });
      }
      const user = await userService.getUserById(id);
      if (!user) {
        return handleResponse(res, 404, { message: "Utilisateur non trouvé" });
      }
      return handleResponse(res, 200, user);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return handleResponse(res, 500, { message: "Erreur Server" });
    }
  },
  // Création d'un utilisateurnode
  createUser: async (req, res) => {
    try {
      const { error, value } = userSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((d) => d.message);
        return handleResponse(res, 400, { errors });
      }
      const existingUser = await userService.getUserByMail(value.mail);
      if (existingUser) {
        return handleResponse(res, 400, { message: "Email déjà utilisé !" });
      }
      const newUser = await userService.createUser(value);
      await mailService.welcomeMail(newUser);
      return handleResponse(res, 201, {
        message: "Utilisateur créé avec succès",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      return handleResponse(res, 500, { message: "Erreur serveur" });
    }
  },
  // Modification d'un utilisateur
  updateUser: async (req, res) => {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, { message: "ID manquant" });
    if (isObjectId(id)) {
      return handleResponse(res, 400, { message: "ID invalide" });
    }
    try {
      // Vérification de l'existence de l'utilisateur
      const user = await userService.getUserById(id);
      if (!user) {
        return handleResponse(res, 404, { message: "Utilisateur introuvable" });
      }
      const { error, value } = updateUserSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((d) => d.message);
        return handleResponse(res, 400, { errors });
      }
      // Mise à jour de l'utilisateur
      const updatedUser = await userService.updateUser(id, value);

      if (!updatedUser) {
        return handleResponse(res, 404, { message: "Utilisateur non trouvé" });
      }
      return handleResponse(res, 200, {
        message: "Utilisateur modifié avec succès !",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      return handleResponse(res, 500, { message: "Erreur serveur" });
    }
  },
  // Suppression d'un utilisateur
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return handleResponse(res, 400, { message: "ID manquant" });
      if (isObjectId(id)) {
        return handleResponse(res, 400, { message: "ID invalide" });
      }
      const user = await userService.getUserById(id);
      if (!user) {
        return handleResponse(res, 404, { message: "Utilisateur introuvable" });
      }
      await userService.deleteUser(id);
      return handleResponse(res, 200, {
        message: "Utilisateur supprimé avec succès !",
      });
    } catch (error) {
      return handleResponse(res, 500, { message: "Erreur serveur" });
    }
  },
};
module.exports = userController;
