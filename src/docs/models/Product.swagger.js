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
 *           description: Identifiant MongoDB
 *         label:
 *           type: string
 *           description: Nom unique du produit
 *           example: "Burger Royal"
 *         description:
 *           type: string
 *           description: Description du produit
 *           example: "Un délicieux burger avec fromage et salade."
 *         price:
 *           type: number
 *           description: Prix du produit
 *           example: 12.99
 *         category:
 *           type: string
 *           enum: ["Plat principal", "Dessert", "Boisson", "Divers"]
 *           default: "Divers"
 *           description: Catégorie du produit
 *         stock:
 *           type: number
 *           description: Quantité en stock
 *           example: 10
 *         available:
 *           type: boolean
 *           default: true
 *           description: Disponibilité du produit
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
