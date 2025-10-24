/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         mail:
 *           type: string
 *           format: mail
 *           description: Adresse mail de l'utilisateur
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe de l'utilisateur
 *     PasswordResetRequest:
 *       type: object
 *       properties:
 *         mail:
 *           type: string
 *           format: mail
 *           description: Adresse mail de l'utilisateur
 *     PasswordRecoveryRequest:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token de réinitialisation envoyé par mail
 *         newPassword:
 *           type: string
 *           format: password
 *           description: Nouveau mot de passe
 *     ConfirmAccountRequest:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token de confirmation envoyé par mail
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints pour l'authentification
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *       401:
 *         description: Identifiants invalides
 *       429:
 *         description: Trop de tentatives de connexion
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion d'un utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 */

/**
 * @swagger
 * /auth/password-reset:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetRequest'
 *     responses:
 *       200:
 *         description: mail de réinitialisation envoyé
 *       404:
 *         description: Utilisateur non trouvé
 *       429:
 *         description: Trop de tentatives
 */

/**
 * @swagger
 * /auth/password-recovery:
 *   patch:
 *     summary: Récupération de mot de passe avec un token de réinitialisation
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordRecoveryRequest'
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *       400:
 *         description: Token invalide ou expiré
 *       429:
 *         description: Trop de tentatives
 */

/**
 * @swagger
 * /auth/confirm-account:
 *   patch:
 *     summary: Confirmation de compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfirmAccountRequest'
 *     responses:
 *       200:
 *         description: Compte confirmé avec succès
 *       400:
 *         description: Token invalide ou expiré
 *       429:
 *         description: Trop de tentatives
 */
