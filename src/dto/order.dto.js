const Joi = require("joi");
const { ObjectId } = require("mongodb");

// Schéma de validation pour un produit dans la commande
const productSchema = Joi.object({
  productId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "Validation de l'ObjectId")
    .required()
    .messages({
      "any.required": "L'ID du produit est requis.",
      "any.invalid": "L'ID du produit est invalide.",
    }),

  quantity: Joi.number().integer().positive().required().messages({
    "number.base": "La quantité doit être un nombre.",
    "number.positive": "La quantité doit être un nombre positif.",
    "any.required": "La quantité est requise.",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Le prix doit être un nombre.",
    "number.positive": "Le prix doit être un nombre positif.",
    "any.required": "Le prix est requis.",
  }),
});

// Schéma de validation pour la création d'une commande
const createOrderSchema = Joi.object({
  userId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "Validation de l'ObjectId")
    .required()
    .messages({
      "any.required": "L'ID de l'utilisateur est requis.",
      "any.invalid": "L'ID de l'utilisateur est invalide.",
    }),

  products: Joi.array().items(productSchema).min(1).required().messages({
    "array.base": "Le tableau des produits est invalide.",
    "array.min": "Le tableau des produits doit contenir au moins un produit.",
    "any.required": "Le tableau des produits est requis.",
  }),

  deliveryAddress: Joi.string().min(10).required().messages({
    "string.base": "L'adresse de livraison doit être une chaîne de caractères.",
    "string.min":
      "L'adresse de livraison doit contenir au moins 10 caractères.",
    "any.required": "L'adresse de livraison est requise.",
  }),
  status: Joi.string()
    .valid(
      "En attente",
      "Validée",
      "Confirmée",
      "Prêt en magasin",
      "Refusée",
      "Annulée"
    )
    .messages({
      "string.base": "Le statut doit être une chaîne de caractères valide.",
      "string.pattern.base":
        "Le statut doit être 'pending', 'processing', 'shipped' ou 'delivered'.",
    }),
});

// Schéma de validation pour la mise à jour d'une commande
const updateOrderSchema = Joi.object({
  userId: Joi.string()
    .custom((value, helpers) => {
      if (value && !ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "Validation de l'ObjectId")
    .optional()
    .messages({
      "any.invalid": "L'ID de l'utilisateur est invalide.",
    }),

  products: Joi.array().items(productSchema).min(1).optional().messages({
    "array.base": "Le tableau des produits est invalide.",
    "array.min": "Le tableau des produits doit contenir au moins un produit.",
  }),

  deliveryAddress: Joi.string().min(10).optional().messages({
    "string.base": "L'adresse de livraison doit être une chaîne de caractères.",
    "string.min":
      "L'adresse de livraison doit contenir au moins 10 caractères.",
  }),
  status: Joi.string()
    .valid(
      "En attente",
      "Validée",
      "Confirmée",
      "Prêt en magasin",
      "Refusée",
      "Annulée"
    )
    .optional()
    .messages({
      "string.base": "Le statut doit être une chaîne de caractères valide.",
      "string.pattern.base":
        "Le statut doit être 'pending', 'processing', 'shipped' ou 'delivered'.",
    }),
})
  .min(1)
  .messages({
    "object.min": "Au moins un champ doit être mis à jour.",
  });

module.exports = {
  createOrderSchema,
  updateOrderSchema,
};
