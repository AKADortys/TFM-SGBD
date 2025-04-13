const userService = require("../services/user.service");
const { ObjectId } = require("mongodb");
const { userSchema, updateUserSchema } = require("../dto/user.dto");
const userController = {
  // Récupération de tous les utilisateurs
  getUsers: async (req, res) => {
    try {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await userService.getUsers(page, limit, search);

      res.status(200).json({
        data: result.users,
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      });
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
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: "Erreur Server" });
    }
  },
  // Création d'un utilisateur
  createUser: async (req, res) => {
    try {
      const { error, value } = userSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(400).json({ errors });
      }
      const existingUser = await userService.getUserByMail(value.mail);
      if (existingUser) {
        return res.status(400).json({ message: "Email déjà utilisé !" });
      }
      const newUser = await userService.createUser(value);
      const response = { ...newUser };
      delete response.password;

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        user: response,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur " });
    }
  },
  // Modification d'un utilisateur
  updateUser: async (req, res) => {
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
      const { error, value } = await updateUserSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(400).json({ errors });
      }
      // Mise à jour de l'utilisateur
      const updatedUser = await userService.updateUser(id, value);

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
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }
      await userService.deleteUser(id);
      res.json({ message: "Utilisateur supprimé avec succès !" }).status(200)
        .json;
    } catch (error) {
      res.status(404).json({ message: "Erreur server" });
    }
  },
};
module.exports = userController;
