/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: Gestion des produits
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupère tous les produits (avec filtres)
 *     tags: [Produits]
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
 *         description: Nombre de produits par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom ou description (insensible à la casse)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: ["Plat principal", "Dessert", "Boisson", "Divers"]
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrer par disponibilité (true/false)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Prix minimum pour le filtre
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Prix maximum pour le filtre
 *       - in: query
 *         name: label
 *         schema:
 *           type: string
 *         description: Filtrer par nom exact du produit
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour filtrer les produits (format YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour filtrer les produits (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crée un nouveau produit
 *     tags: [Produits]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupère un produit par ID
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Met à jour un produit
 *     tags: [Produits]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       400:
 *         description: ID invalide ou données incorrectes
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Supprime un produit
 *     tags: [Produits]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       400:
 *         description: ID invalide ou manquant
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
