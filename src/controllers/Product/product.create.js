const { create } = require("../../services/product.index");
const { handleResponse } = require("../../utils/controller.util");
const { productSchema } = require("../../dto/product.dto");

// Création d'un nouveau produit
module.exports = async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return handleResponse(res, 400, errors);
    }

    const newProduct = await create(value);
    
    // Emit event to all connected clients
    const io = req.app.get("io");
    if (io) {
      io.emit("product:created", newProduct);
    }

    return handleResponse(res, 201, "Produit créé avec succès", newProduct);
  } catch (error) {
    if (error.message.includes("E11000"))
      return handleResponse(res, 400, "Le nom du produit existe déjà !");
    console.error("Erreur lors de la création du produit:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
