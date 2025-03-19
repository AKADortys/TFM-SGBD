const Joi = require("joi");

const productSchema = Joi.object({
  label: Joi.string().min(2).required().messages({
    "string.base": "Le libellé doit être une chaîne de caractères.",
    "string.min": "Le libellé doit contenir au moins 2 caractères.",
    "any.required": "Le libellé est requis.",
  }),
  description: Joi.string().min(10).required().messages({
    "string.base": "La description doit être une chaîne de caractères.",
    "string.min": "La description doit contenir au moins 10 caractères.",
    "any.required": "La description est requise.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Le prix doit être un nombre.",
    "number.min": "Le prix doit être supérieur ou égal à 0.",
    "any.required": "Le prix est requis.",
  }),
  category: Joi.string().min(1).optional().messages({
    "string.base": "La catégorie doit être une chaîne de caractères.",
    "string.min": "La catégorie doit contenir au moins 1 caractère.",
  }),
  available: Joi.boolean().optional().messages({
    "boolean.base": "La valeur de la disponibilité doit être bool",
  }),
});

const updateProductSchema = Joi.object({
  label: Joi.string().min(2).allow("").messages({
    "string.base": "Le libellé doit être une chaîne de caractères.",
    "string.min": "Le libellé doit contenir au moins 2 caractères.",
  }),
  description: Joi.string().min(10).allow("").messages({
    "string.base": "La description doit être une chaîne de caractères.",
    "string.min": "La description doit contenir au moins 10 caractères.",
  }),
  price: Joi.number().min(0).allow("").messages({
    "number.base": "Le prix doit être un nombre.",
    "number.min": "Le prix doit être supérieur ou égal à 0.",
  }),
  category: Joi.string().min(1).allow("").messages({
    "string.base": "La catégorie doit être une chaîne de caractères.",
    "string.min": "La catégorie doit contenir au moins 1 caractère.",
  }),
  available: Joi.boolean().optional().messages({
    "boolean.base": "La valeur de la disponibilité doit être bool",
  }),
})
  .min(1)
  .messages({
    "object.min": "Vous devez fournir au moins un champ à mettre à jour.",
  });

module.exports = {
  productSchema,
  updateProductSchema,
};
