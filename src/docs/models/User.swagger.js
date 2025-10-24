/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - mail
 *         - phone
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Identifiant MongoDB
 *         name:
 *           type: string
 *           description: Prénom de l'utilisateur
 *           minLength: 2
 *           maxLength: 50
 *           example: Jean
 *         lastName:
 *           type: string
 *           description: Nom de famille de l'utilisateur
 *           minLength: 2
 *           maxLength: 50
 *           example: Dupont
 *         mail:
 *           type: string
 *           format: email
 *           description: Adresse email unique
 *           example: jean.dupont@example.com
 *         phone:
 *           type: string
 *           description: Numéro de téléphone chiffré
 *           example: "+33612345678"
 *         password:
 *           type: string
 *           description: Mot de passe haché
 *           minLength: 8
 *           example: "Motdepasse123"
 *         role:
 *           type: string
 *           enum: [admin, client, moderateur]
 *           default: client
 *           description: Rôle de l'utilisateur
 *         isActive:
 *           type: boolean
 *           default: false
 *           description: Indique si le compte est activé
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
