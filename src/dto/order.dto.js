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

  productName: Joi.string().required().messages({
    "string.base": "Le nom du produit doit être une chaîne de caractères.",
    "any.required": "Le nom du produit est requis.",
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
    .optional()
    .messages({
      "any.required": "L'ID de l'utilisateur est requis.",
      "any.invalid": "L'ID de l'utilisateur est invalide.",
    }),

  products: Joi.array().items(productSchema).min(1).required().messages({
    "array.base": "Le tableau des produits est invalide.",
    "array.min": "Le tableau des produits doit contenir au moins un produit.",
    "any.required": "Le tableau des produits est requis.",
  }),

  deliveryAddress: Joi.object({
    street: Joi.string().required().messages({
      "any.required": "La rue de livraison est requise.",
      "string.base": "La rue doit être une chaîne de caractères.",
    }),
    city: Joi.string().required().messages({
      "any.required": "La ville de livraison est requise.",
      "string.base": "La ville doit être une chaîne de caractères.",
    }),
    zipCode: Joi.string().required().messages({
      "any.required": "Le code postal est requis.",
      "string.base": "Le code postal doit être une chaîne de caractères.",
    }),
    coordinates: Joi.object({
      lat: Joi.number().required().messages({
        "any.required": "La latitude est requise.",
        "number.base": "La latitude doit être un nombre.",
      }),
      lng: Joi.number().required().messages({
        "any.required": "La longitude est requise.",
        "number.base": "La longitude doit être un nombre.",
      }),
    }).required().messages({
      "any.required": "Les coordonnées de livraison sont requises.",
    }),
  }).optional().messages({
    "object.base": "L'adresse de livraison doit être un objet complet.",
  }),
  status: Joi.string()
    .valid(
      "En attente",
      "Payée",
      "En préparation",
      "Refusée",
      "Annulée",
      "Terminée"
    )
    .messages({
      "string.base": "Le statut doit être une chaîne de caractères valide.",
      "string.pattern.base":
        "Le statut doit être 'En attente', 'Payée', 'En préparation', 'Refusée', 'Annulée' ou 'Terminée'.",
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

  deliveryAddress: Joi.object({
    street: Joi.string().optional().messages({
      "string.base": "La rue doit être une chaîne de caractères.",
    }),
    city: Joi.string().optional().messages({
      "string.base": "La ville doit être une chaîne de caractères.",
    }),
    zipCode: Joi.string().optional().messages({
      "string.base": "Le code postal doit être une chaîne de caractères.",
    }),
    coordinates: Joi.object({
      lat: Joi.number().optional().messages({
        "number.base": "La latitude doit être un nombre.",
      }),
      lng: Joi.number().optional().messages({
        "number.base": "La longitude doit être un nombre.",
      }),
    }).optional(),
  }).optional().messages({
    "object.base": "L'adresse de livraison doit être un objet complet.",
  }),
  status: Joi.string()
    .valid(
      "En attente",
      "Payée",
      "En préparation",
      "Refusée",
      "Annulée",
      "Terminée"
    )
    .optional()
    .messages({
      "string.base": "Le statut doit être une chaîne de caractères valide.",
      "string.pattern.base":
        "Le statut doit être 'En attente', 'Payée', 'En préparation', 'Refusée', 'Annulée' ou 'Terminée'.",
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
