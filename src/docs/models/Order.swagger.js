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
 *         - userId
 *         - products
 *         - totalPrice
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
 */
