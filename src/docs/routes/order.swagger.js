/**
 * @swagger
 * tags:
 *   name: Commandes
 *   description: Gestion des commandes
 */
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Récupère toutes les commandes (avec filtres)
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
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
 *           enum: ["En attente", "Confirmée", "Accepté", "Refusée", "Annulée", "Complétée"]
 *         description: Filtrer par statut de commande
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filtrer par ID de produit
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrer par ID d'utilisateur
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour filtrer les commandes (format YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour filtrer les commandes (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Récupère une commande par ID
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /orders/user/{id}:
 *   get:
 *     summary: Récupère les commandes d'un utilisateur
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["En attente", "Confirmée", "Accepté", "Refusée", "Annulée", "Complétée"]
 *         description: Filtrer par statut de commande
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filtrer par ID de produit
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrer par ID d'utilisateur
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour filtrer les commandes (format YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour filtrer les commandes (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Commandes de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /orders/history:
 *   get:
 *     summary: Récupère l'historique des commandes de l'utilisateur connecté
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
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
 *           enum: ["En attente", "Confirmée", "Accepté", "Refusée", "Annulée", "Complétée"]
 *         description: Filtrer par statut de commande
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filtrer par ID de produit
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrer par ID d'utilisateur
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour filtrer les commandes (format YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour filtrer les commandes (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Historique des commandes récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crée une nouvelle commande
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Met à jour une commande
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Commande mise à jour avec succès
 *       400:
 *         description: ID invalide ou données incorrectes
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Supprime une commande
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       400:
 *         description: ID invalide ou manquant
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /orders/stats/general:
 *   get:
 *     summary: Récupère les statistiques générales des commandes
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: integer
 *                 totalRevenue:
 *                   type: number
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /orders/stats/by-date:
 *   get:
 *     summary: Récupère les statistiques des commandes par date
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour les statistiques (format YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour les statistiques (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ordersByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
 *                       totalRevenue:
 *                         type: number
 *       500:
 *         description: Erreur serveur
 */
