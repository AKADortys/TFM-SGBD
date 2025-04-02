module.exports = (req, res, next) => {
  try {
    // Vérifie si l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    console.log(req.user.id === req.params.id);
    console.log(req.params.id);
    console.log(req.user.id);
    // Vérifie si l'utilisateur a le rôle admin
    if (req.user.role !== "admin" && req.user.id !== req.params?.id) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    next();
  } catch (error) {
    console.error("Erreur lors de la vérification des permissions :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
