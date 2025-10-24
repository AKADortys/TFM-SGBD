/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - lastName
 *         - mail
 *         - phone
 *         - password
 *         - role
 *         - isActive
 *       properties:
 *         _id:
 *           type: string
 *           description: Identifiant MongoDB
 *           example: "672a0f6a9b8a2f001f7c9f02"
 *         name:
 *           type: string
 *           description: Prénom de l'utilisateur
 *           minLength: 2
 *           maxLength: 50
 *           example: Jean
 *         lastName:
 *           type: string
 *           description: Nom de famille de l'utilisateur
 *           minLength: 2
 *           maxLength: 50
 *           example: Dupont
 *         mail:
 *           type: string
 *           format: email
 *           description: Adresse email unique
 *           example: jean.dupont@example.com
 *         phone:
 *           type: string
 *           description: Numéro de téléphone chiffré
 *           example: "+33612345678"
 *         password:
 *           type: string
 *           description: Mot de passe haché
 *           minLength: 8
 *           example: "$2a$10$N9qo8uLOickgx2ZMRZoMy..."
 *         role:
 *           type: string
 *           enum: [admin, client, moderateur]
 *           default: client
 *           description: Rôle de l'utilisateur
 *         isActive:
 *           type: boolean
 *           default: false
 *           description: Indique si le compte est activé
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Dernière mise à jour
 *     PaginatedUsers:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: Nombre total d'utilisateurs
 *             page:
 *               type: integer
 *               description: Numéro de la page actuelle
 *             limit:
 *               type: integer
 *               description: Nombre d'utilisateurs par page
 *             totalPages:
 *               type: integer
 *               description: Nombre total de pages
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - mail
 *         - phone
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Prénom de l'utilisateur
 *           minLength: 2
 *           maxLength: 50
 *           example: Jean
 *         lastName:
 *           type: string
 *           description: Nom de famille de l'utilisateur
 *           minLength: 2
 *           maxLength: 50
 *           example: Dupont
 *         mail:
 *           type: string
 *           format: email
 *           description: Adresse email unique
 *           example: jean.dupont@example.com
 *         phone:
 *           type: string
 *           description: Numéro de téléphone
 *           example: "+33612345678"
 *         password:
 *           type: string
 *           description: Mot de passe (sera haché)
 *           minLength: 8
 *           example: "Motdepasse123"
 *         role:
 *           type: string
 *           enum: [admin, client, moderateur]
 *           default: client
 *           description: Rôle de l'utilisateur
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Prénom de l'utilisateur
 *           minLength: 2
 *           maxLength: 50
 *           example: Jean
 *         lastName:
 *           type: string
 *           description: Nom de famille de l'utilisateur
 *           minLength: 2
 *           maxLength: 50
 *           example: Dupont
 *         mail:
 *           type: string
 *           format: email
 *           description: Adresse email unique
 *           example: jean.dupont@example.com
 *         phone:
 *           type: string
 *           description: Numéro de téléphone
 *           example: "+33612345678"
 *         password:
 *           type: string
 *           description: Nouveau mot de passe (sera haché)
 *           minLength: 8
 *           example: "NouveauMotdepasse123"
 *         role:
 *           type: string
 *           enum: [admin, client, moderateur]
 *           description: Rôle de l'utilisateur
 *         isActive:
 *           type: boolean
 *           description: Indique si le compte est activé
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints pour la gestion des utilisateurs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère la liste des utilisateurs (paginée)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'utilisateurs par page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, client, moderateur]
 *         description: Filtrer par rôle
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut d'activation
 *     responses:
 *       200:
 *         description: Liste paginée des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUsers'
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide
 *       429:
 *         description: Trop de requêtes (limite dépassée)
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son identifiant
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f02"
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f02"
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f02"
 *         description: ID de l'utilisateur
 *     responses:
 *       204:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 *       404:
 *         description: Utilisateur non trouvé
 */
