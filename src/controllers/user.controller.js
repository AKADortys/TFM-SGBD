const userService = require("../services/user.service");
const authService = require("../services/authentification.service");
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

      return handleResponse(
        res,
        200,
        "utilisateurs récupérés avec succès",
        result
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      return handleResponse(res, 500, error.message);
    }
  },
  // Récupération d'un utilisateur par ID
  getUserById: async (req, res) => {
    try {
      const id = req.params.id;
      if (isObjectId(id)) {
        return handleResponse(res, 400, "ID invalide");
      }
      const user = await userService.getUserById(id);
      if (!user) {
        return handleResponse(res, 404, "Utilisateur non trouvé");
      }
      return handleResponse(res, 200, "Utilisateur récupéré avec succès", user);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return handleResponse(res, 500, "Erreur Server");
    }
  },
  // Création d'un nouvel utilisateur
  createUser: async (req, res) => {
    try {
      const { error, value } = userSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((d) => d.message);
        return handleResponse(res, 400, errors);
      }
      const existingUser = await userService.getUserByMail(value.mail);
      if (existingUser) {
        return handleResponse(res, 400, "Email déjà utilisé !");
      }
      const newUser = await userService.createUser(value);
      const token = await authService.createToken(
        newUser._id,
        req.ip,
        req.get("User-Agent"),
        "account_confirmation"
      );
      await mailService.welcomeMail(newUser, token);
      return handleResponse(res, 201, "Utilisateur créé avec succès", newUser);
    } catch (error) {
      console.error(error);
      return handleResponse(res, 500, "Erreur serveur");
    }
  },
  // Modification d'un utilisateur
  updateUser: async (req, res) => {
    const id = req.params.id;
    if (!id) return handleResponse(res, 400, "ID manquant");
    if (isObjectId(id)) {
      return handleResponse(res, 400, "ID invalide");
    }
    try {
      // Vérification de l'existence de l'utilisateur
      if (req.user.id !== id && req.user.role !== "admin") {
        return handleResponse(res, 403, "Accès refusé");
      }
      const user = await userService.getUserById(id);
      if (!user) {
        return handleResponse(res, 404, "Utilisateur introuvable");
      }
      const { error, value } = updateUserSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((d) => d.message);
        return handleResponse(res, 400, errors);
      }
      const existingUser = await userService.getUserByMail(value.mail);
      if (existingUser) {
        return handleResponse(res, 400, "Email déjà utilisé !");
      }
      // Mise à jour de l'utilisateur
      const updatedUser = await userService.updateUser(id, value);

      if (!updatedUser) {
        return handleResponse(res, 404, "Utilisateur non trouvé");
      }
      return handleResponse(
        res,
        200,
        "Utilisateur modifié avec succès !",
        updatedUser
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      return handleResponse(res, 500, "Erreur serveur");
    }
  },
  // Suppression d'un utilisateur
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      if (req.user.id !== id && req.user.role !== "admin") {
        return handleResponse(res, 403, "Accès refusé");
      }
      if (!id) return handleResponse(res, 400, "ID manquant");
      if (isObjectId(id)) {
        return handleResponse(res, 400, "ID invalide");
      }
      const user = await userService.getUserById(id);
      if (!user) {
        return handleResponse(res, 404, "Utilisateur introuvable");
      }
      await userService.deleteUser(id);
      return handleResponse(res, 200, "Utilisateur supprimé avec succès !");
    } catch (error) {
      return handleResponse(res, 500, "Erreur serveur");
    }
  },
};
module.exports = userController;
