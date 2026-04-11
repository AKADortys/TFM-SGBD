/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - products
 *         - totalPrice
 *       properties:
 *         _id:
 *           type: string
 *           description: Identifiant MongoDB
 *         userId:
 *           type: string
 *           description: ID de l'utilisateur
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID du produit
 *               quantity:
 *                 type: number
 *                 description: Quantité commandée
 *               price:
 *                 type: number
 *                 description: Prix unitaire
 *         deliveryAddress:
 *           type: string
 *           description: Adresse de livraison
 *         status:
 *           type: string
 *           enum: ["En attente", "Payée", "En préparation", "Refusée", "Annulée", "Terminée"]
 *           default: "Payée"
 *           description: Statut de la commande
 *         totalPrice:
 *           type: number
 *           description: Prix total de la commande
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
