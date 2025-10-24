/**
 * @swagger
 * components:
 *   schemas:
 *     OrderProduct:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - price
 *       properties:
 *         productId:
 *           type: string
 *           description: ID du produit associé
 *           example: "672a0f6a9b8a2f001f7c9f01"
 *         quantity:
 *           type: integer
 *           description: Quantité commandée
 *           example: 2
 *         price:
 *           type: number
 *           format: float
 *           description: Prix unitaire du produit au moment de la commande
 *           example: 19.99
 *
 *     Order:
 *       type: object
 *       required:
 *         - _id
 *         - userId
 *         - products
 *         - totalPrice
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique de la commande
 *           example: "672a0f6a9b8a2f001f7c9f99"
 *         userId:
 *           type: string
 *           description: Référence vers l'utilisateur qui a passé la commande
 *           example: "672a0f6a9b8a2f001f7c9f88"
 *         products:
 *           type: array
 *           description: Liste des produits de la commande
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 *         deliveryAddress:
 *           type: string
 *           description: Adresse de livraison
 *           example: "12 rue des Lilas, 75000 Paris"
 *         status:
 *           type: string
 *           enum: ["En attente", "Confirmée", "Accepté", "Refusée", "Annulée"]
 *           default: "En attente"
 *           description: Statut actuel de la commande
 *         totalPrice:
 *           type: number
 *           format: float
 *           description: Prix total de la commande
 *           example: 59.97
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Dernière mise à jour
 *
 *     PaginatedOrders:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: Nombre total de commandes
 *             page:
 *               type: integer
 *               description: Numéro de la page actuelle
 *             limit:
 *               type: integer
 *               description: Nombre de commandes par page
 *             totalPages:
 *               type: integer
 *               description: Nombre total de pages
 *
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - userId
 *         - products
 *         - totalPrice
 *       properties:
 *         userId:
 *           type: string
 *           description: Référence vers l'utilisateur qui passe la commande
 *           example: "672a0f6a9b8a2f001f7c9f88"
 *         products:
 *           type: array
 *           description: Liste des produits de la commande
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 *         deliveryAddress:
 *           type: string
 *           description: Adresse de livraison
 *           example: "12 rue des Lilas, 75000 Paris"
 *         status:
 *           type: string
 *           enum: ["En attente", "Confirmée", "Accepté", "Refusée", "Annulée"]
 *           default: "En attente"
 *           description: Statut initial de la commande
 *         totalPrice:
 *           type: number
 *           format: float
 *           description: Prix total de la commande
 *           example: 59.97
 *
 *     UpdateOrderRequest:
 *       type: object
 *       properties:
 *         deliveryAddress:
 *           type: string
 *           description: Nouvelle adresse de livraison
 *           example: "15 avenue des Champs, 75000 Paris"
 *         status:
 *           type: string
 *           enum: ["En attente", "Confirmée", "Accepté", "Refusée", "Annulée"]
 *           description: Nouveau statut de la commande
 *         totalPrice:
 *           type: number
 *           format: float
 *           description: Nouveau prix total de la commande
 *           example: 69.97
 *         products:
 *           type: array
 *           description: Nouvelle liste des produits de la commande
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Endpoints pour la gestion des commandes
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Récupère la liste des commandes (paginée)
 *     tags: [Orders]
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
 *         description: Nombre de commandes par page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["En attente", "Confirmée", "Accepté", "Refusée", "Annulée"]
 *         description: Filtrer par statut
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrer par ID utilisateur
 *     responses:
 *       200:
 *         description: Liste paginée des commandes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 */

/**
 * @swagger
 * /orders/detail/{id}:
 *   get:
 *     summary: Récupère une commande avec ses détails
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f99"
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Détails de la commande
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 *       404:
 *         description: Commande non trouvée
 */

/**
 * @swagger
 * /orders/user/{id}:
 *   get:
 *     summary: Récupère les commandes d'un utilisateur (paginé)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f88"
 *         description: ID de l'utilisateur
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
 *         description: Nombre de commandes par page
 *     responses:
 *       200:
 *         description: Liste paginée des commandes de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /orders/status/{status}:
 *   get:
 *     summary: Récupère les commandes par statut (paginé)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["En attente", "Confirmée", "Accepté", "Refusée", "Annulée"]
 *         description: Statut des commandes
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
 *         description: Nombre de commandes par page
 *     responses:
 *       200:
 *         description: Liste paginée des commandes par statut
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 */
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Récupère une commande par son identifiant
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f99"
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Détails de la commande
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       404:
 *         description: Commande non trouvée
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crée une nouvelle commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 */
/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Met à jour une commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f99"
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderRequest'
 *     responses:
 *       200:
 *         description: Commande mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 *       404:
 *         description: Commande non trouvée
 */
/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Annule une commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f99"
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande annulée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       404:
 *         description: Commande non trouvée
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Supprime une commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f99"
 *         description: ID de la commande
 *     responses:
 *       204:
 *         description: Commande supprimée avec succès
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 *       404:
 *         description: Commande non trouvée
 */
