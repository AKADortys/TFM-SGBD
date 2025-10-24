/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       required:
 *         - userId
 *         - token_hash
 *         - type
 *         - expiresAt
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique du token
 *           example: "672a0f6a9b8a2f001f7c9f55"
 *         userId:
 *           type: string
 *           description: ID de l'utilisateur associé
 *           example: "672a0f6a9b8a2f001f7c9f33"
 *         token_hash:
 *           type: string
 *           description: Hash du token stocké en base
 *           example: "$2b$10$8jQKXjFfGdfFqV6n1n1M.e/j2uS4aT2EcljvWgVZzAqv3f4W/VjSa"
 *         type:
 *           type: string
 *           enum: ["password_reset", "account_confirmation"]
 *           description: Type du token
 *           example: "account_confirmation"
 *         used:
 *           type: boolean
 *           default: false
 *           description: Indique si le token a déjà été utilisé
 *         usedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Date d'utilisation du token
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Date d’expiration du token
 *           example: "2025-11-01T12:00:00Z"
 *         requestIp:
 *           type: string
 *           nullable: true
 *           description: Adresse IP à l'origine de la requête
 *           example: "192.168.1.15"
 *         userAgent:
 *           type: string
 *           nullable: true
 *           description: Agent utilisateur à l'origine de la requête
 *           example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Dernière mise à jour
 */
