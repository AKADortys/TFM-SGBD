const Joi = require("joi");

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:mm format

const openingHoursSchema = Joi.object({
    dayOfWeek: Joi.number().min(0).max(6).required(),
    isOpen: Joi.boolean().required(),
    morning: Joi.object({
        start: Joi.string().pattern(timePattern).required(),
        end: Joi.string().pattern(timePattern).required(),
        _id: Joi.any().strip(), // Allow and strip if present
    }).required().unknown(true), // Allow internal _id if any
    afternoon: Joi.object({
        start: Joi.string().pattern(timePattern).required(),
        end: Joi.string().pattern(timePattern).required(),
        _id: Joi.any().strip(), // Allow and strip if present
    }).required().unknown(true), // Allow internal _id if any
    _id: Joi.any().strip(), // Allow and strip _id
}).unknown(true); // Allow other Mongoose internals like parent IDs if nested

const plannedClosureSchema = Joi.object({
    start: Joi.date().required(),
    end: Joi.date().greater(Joi.ref('start')).required().messages({
        "date.greater": "La date de fin doit être postérieure à la date de début."
    }),
    reason: Joi.string().allow('').optional(),
    _id: Joi.any().strip(),
}).unknown(true);

const updateConfigSchema = Joi.object({
    isStoreOpen: Joi.boolean().optional(),
    openingHours: Joi.array().items(openingHoursSchema).unique('dayOfWeek').optional(),
    plannedClosures: Joi.array().items(plannedClosureSchema).optional(),
    siteInfo: Joi.object({
        address: Joi.string().allow('').optional(),
        phone: Joi.string().allow('').optional(),
        email: Joi.string().email().allow('').optional(),
        description: Joi.string().allow('').optional(),
        aboutUsContent: Joi.string().allow('').optional(),
        _id: Joi.any().strip()
    }).optional(),
    socials: Joi.object({
        facebook: Joi.string().allow('').optional(),
        instagram: Joi.string().allow('').optional(),
        twitter: Joi.string().allow('').optional(),
        _id: Joi.any().strip()
    }).optional(),
    _id: Joi.any().strip(),
    createdAt: Joi.any().strip(),
    updatedAt: Joi.any().strip(),
    __v: Joi.any().strip(),
}).min(1);

module.exports = {
    updateConfigSchema,
};
