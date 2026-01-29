/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Gestion de l'authentification des utilisateurs
 *
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mail
 *               - password
 *             properties:
 *               mail:
 *                 type: string
 *                 example: user@mail.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Identifiants incorrects
 *       403:
 *         description: Compte non activé
 */
/**
 * @openapi
 * /auth/confirm-account:
 *   post:
 *     summary: Confirmation du compte utilisateur
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Compte confirmé avec succès
 *       400:
 *         description: Lien invalide ou expiré
 */
/**
 * @openapi
 * /auth/password-recovery:
 *   post:
 *     summary: Demande de réinitialisation du mot de passe
 *     description: Envoie un email de réinitialisation du mot de passe à l'utilisateur.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mail
 *             properties:
 *               mail:
 *                 type: string
 *                 example: user@mail.com
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 */
/**
 * @openapi
 * /auth/password-reset:
 *   post:
 *     summary: Réinitialisation du mot de passe
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *       400:
 *         description: Token invalide ou mot de passe incorrect
 */
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     tags:
 *       - Authentification
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
