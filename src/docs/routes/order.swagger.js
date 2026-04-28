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
 *           enum: ["En attente", "Payée", "En préparation", "Refusée", "Annulée", "Terminée"]
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
 * /orders/detail/{id}:
 *   get:
 *     summary: Récupère une commande détaillée par ID
 *     description: Récupère les détails complets d'une commande, y compris les informations utilisateur et produits peuplées.
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
 *         description: Commande détaillée récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     mail:
 *                       type: string
 *                     phone:
 *                       type: string
 *                 deliveryAddress:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     zipCode:
 *                       type: string
 *                 status:
 *                   type: string
 *                 totalPrice:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       quantity:
 *                         type: integer
 *                       productDetails:
 *                         $ref: '#/components/schemas/Product'
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
 *           enum: ["En attente", "Payée", "En préparation", "Refusée", "Annulée", "Terminée"]
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
 *           enum: ["En attente", "Payée", "En préparation", "Refusée", "Annulée", "Terminée"]
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
 *     summary: Met à jour une commande (envoier un email si le statut change à "Payée", "En préparation", "Refusée", "Annulée")
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

/**
 * @swagger
 * /orders/checkout-session:
 *   post:
 *     summary: Crée une session de paiement Stripe Checkout
 *     description: Crée une session Checkout sur Stripe pour les produits demandés et renvoie l'URL de paiement.
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               deliveryAddress:
 *                 type: string
 *                 description: L'adresse de livraison de la commande
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID MongoDB du produit
 *                     quantity:
 *                       type: integer
 *                       description: Quantité commandée
 *     responses:
 *       200:
 *         description: URL de redirection Stripe créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: L'URL Stripe Checkout vers laquelle rediriger le client
 *       400:
 *         description: Panier vide, produit introuvable ou stock insuffisant
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /orders/checkout-session/{sessionId}/verify:
 *   get:
 *     summary: Vérifie le statut d'une session Stripe Checkout
 *     description: Récupère la session depuis Stripe, vérifie la commande associée et retourne le statut consolidé.
 *     tags: [Commandes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la session Stripe
 *     responses:
 *       200:
 *         description: Statut de la commande récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       description: Statut de la commande en base de données
 *                     payment_status:
 *                       type: string
 *                       description: Statut du paiement Stripe
 *                     orderId:
 *                       type: string
 *                       description: ID de la commande
 *       400:
 *         description: Session ID manquant ou aucune commande associée
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Session ou commande introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /orders/checkout-session/{id}/resume:
 *   post:
 *     summary: Reprend une session de paiement Stripe
 *     description: Régénère une URL Stripe Checkout pour une commande existante "En attente" de paiement.
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
 *         description: Session de paiement reprise avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: Nouvelle URL Stripe Checkout vers laquelle rediriger le client
 *       400:
 *         description: ID invalide, commande non en attente, produit inexistant ou stock insuffisant
 *       403:
 *         description: Vous n'êtes pas autorisé à reprendre cette commande
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /orders/webhook:
 *   post:
 *     summary: Réceptionne des événements Stripe (Webhook)
 *     description: Endpoint asynchrone pour Stripe. Ne nécessite pas de JWT. Accepte le payload brut (rawBody) pour valider la signature cryptographique.
 *     tags: [Commandes]
 *     responses:
 *       200:
 *         description: Webhook reçu et traité avec succès
 *       400:
 *         description: Signature invalide ou données manquantes
 */
