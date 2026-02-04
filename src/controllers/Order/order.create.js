const { create } = require("../../services/orders.index");
const { getById, update } = require("../../services/product.index");
const mailService = require("../../services/mail.service");
const { createOrderSchema } = require("../../dto/order.dto");
const { handleResponse, isObjectId } = require("../../utils/controller.util");

// Création d'une commande
module.exports = async (req, res) => {
  try {
    const { error, value } = createOrderSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    let { userId, products, deliveryAddress, status } = value;
    if (!userId) userId = req.user?.id;
    for (const element of products) {
      if (isObjectId(element.productId))
        return handleResponse(
          res,
          400,
          "ID produit invalide :" + element.productId,
        );
      const exist = await getById(element.productId);
      if (!exist)
        return handleResponse(
          res,
          400,
          "Produit inexistant :" + element.productId,
        );
      if (element.quantity > exist.stock)
        return handleResponse(
          res,
          400,
          `Quantité insuffisante pour le produit ${exist.label}. Stock disponible : ${exist.stock}, quantité demandée : ${element.quantity}.`,
        );
      element.price = exist.price;
      if (exist.stock - element.quantity === 0) {
        await update(element.productId, { available: false });
      }
    }

    let totalPrice = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0,
    );
    const newOrder = {
      userId,
      products,
      deliveryAddress,
      totalPrice,
      status,
    };
    const order = await create(newOrder);
    for (const p of products) {
      await update(p.productId, { $inc: { stock: -p.quantity } });
    }
    await mailService.newOrder(order, req.user);
    return handleResponse(res, 201, "Commande créée avec succès", order);
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
