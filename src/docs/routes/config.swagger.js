/**
 * @swagger
 * tags:
 *   name: Configuration
 *   description: Gestion de la configuration du magasin (horaires, fermetures)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OpeningHour:
 *       type: object
 *       properties:
 *         dayOfWeek:
 *           type: integer
 *           description: Jour de la semaine (0 = Dimanche, 6 = Samedi)
 *         isOpen:
 *           type: boolean
 *           description: Indique si le magasin est ouvert ce jour-là
 *         morning:
 *           type: object
 *           properties:
 *             start:
 *               type: string
 *               example: "09:00"
 *             end:
 *               type: string
 *               example: "12:00"
 *         afternoon:
 *           type: object
 *           properties:
 *             start:
 *               type: string
 *               example: "14:00"
 *             end:
 *               type: string
 *               example: "18:00"
 *     PlannedClosure:
 *       type: object
 *       properties:
 *         start:
 *           type: string
 *           format: date-time
 *           description: Date de début de la fermeture
 *         end:
 *           type: string
 *           format: date-time
 *           description: Date de fin de la fermeture
 *         reason:
 *           type: string
 *           description: Raison de la fermeture
 *     Config:
 *       type: object
 *       properties:
 *         isStoreOpen:
 *           type: boolean
 *           description: Interrupteur principal pour l'ouverture du magasin
 *         openingHours:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OpeningHour'
 *         plannedClosures:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlannedClosure'
 *         reason:
 *           type: string
 *           description: Raison de la fermeture (déprécié, utilisez plannedClosures)
 */

/**
 * @swagger
 * /config:
 *   get:
 *     summary: Récupère la configuration actuelle du magasin
 *     tags: [Configuration]
 *     responses:
 *       200:
 *         description: Configuration récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Configuration récupérée avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Config'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /config:
 *   patch:
 *     summary: Met à jour la configuration du magasin
 *     tags: [Configuration]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Config'
 *     responses:
 *       200:
 *         description: Configuration mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Configuration mise à jour avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Config'
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé (Admin requis)
 *       500:
 *         description: Erreur serveur
 */
