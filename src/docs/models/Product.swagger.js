/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
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
 */
