/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - _id
 *         - label
 *         - description
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique du produit
 *           example: "672a0f6a9b8a2f001f7c9f01"
 *         label:
 *           type: string
 *           description: Nom du produit
 *           example: "Burger maison"
 *         description:
 *           type: string
 *           description: Détails du produit
 *           example: "Burger artisanal avec pain brioché et steak frais"
 *         price:
 *           type: number
 *           format: float
 *           description: Prix du produit
 *           example: 12.5
 *         category:
 *           type: string
 *           enum: ["Plat principal", "Dessert", "Boisson", "Divers"]
 *           default: "Divers"
 *           description: Catégorie du produit
 *         available:
 *           type: boolean
 *           default: true
 *           description: Indique si le produit est disponible à la commande
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Dernière mise à jour
 *     PaginatedProducts:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           items:
 *             $ref: '#/components/schemas/Product'
 *             total:
 *             type: integer
 *             description: Nombre total de produits
 *             page:
 *               type: integer
 *               description: Numéro de la page actuelle
 *             limit:
 *               type: integer
 *               description: Nombre de produits par page
 *             totalPages:
 *               type: integer
 *               description: Nombre total de pages
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - label
 *         - description
 *         - price
 *       properties:
 *         label:
 *           type: string
 *           description: Nom du produit
 *           example: "Burger maison"
 *         description:
 *           type: string
 *           description: Détails du produit
 *           example: "Burger artisanal avec pain brioché et steak frais"
 *         price:
 *           type: number
 *           format: float
 *           description: Prix du produit
 *           example: 12.5
 *         category:
 *           type: string
 *           enum: ["Plat principal", "Dessert", "Boisson", "Divers"]
 *           default: "Divers"
 *           description: Catégorie du produit
 *         available:
 *           type: boolean
 *           default: true
 *           description: Indique si le produit est disponible à la commande
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *           description: Nom du produit
 *           example: "Burger maison"
 *         description:
 *           type: string
 *           description: Détails du produit
 *           example: "Burger artisanal avec pain brioché et steak frais"
 *         price:
 *           type: number
 *           format: float
 *           description: Prix du produit
 *           example: 12.5
 *         category:
 *           type: string
 *           enum: ["Plat principal", "Dessert", "Boisson", "Divers"]
 *           description: Catégorie du produit
 *         available:
 *           type: boolean
 *           description: Indique si le produit est disponible à la commande
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints pour la gestion des produits
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupère la liste des produits (paginée)
 *     tags: [Products]
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
 *           enum: ["Plat principal", "Dessert", "Boisson", "Divers"]
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrer par disponibilité
 *     responses:
 *       200:
 *         description: Liste paginée des produits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProducts'
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupère un produit par son identifiant
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f01"
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Détails du produit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crée un nouveau produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Met à jour un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f01"
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 *       404:
 *         description: Produit non trouvé
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Supprime un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "672a0f6a9b8a2f001f7c9f01"
 *         description: ID du produit
 *     responses:
 *       204:
 *         description: Produit supprimé avec succès
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (permissions insuffisantes)
 *       404:
 *         description: Produit non trouvé
 */
