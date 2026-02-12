const orderService = require("../../services/orders.index");
const productService = require("../../services/product.index");
const mailService = require("../../services/mail.service");
const userService = require("../../services/user.index");
const Product = require("../../models/Product");
const { updateOrderSchema } = require("../../dto/order.dto");
const { isObjectId, handleResponse } = require("../../utils/controller.util");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const idError = isObjectId(id);
    if (idError) return handleResponse(res, 400, idError);

    const existingOrder = await orderService.getById(id);
    if (!existingOrder) {
      return handleResponse(res, 404, "Commande non trouvée");
    }
    // Vérification des droits d'accès
    if (
      req.user.id !== existingOrder.userId?._id?.toString() &&
      req.user.role !== "admin"
    ) {
      return handleResponse(res, 403, "Accès refusé");
    }

    const modifiableStatuses = ["En attente", "Confirmée"];
    if (!modifiableStatuses.includes(existingOrder.status)) {
      return handleResponse(
        res,
        400,
        `La commande ne peut pas être modifiée car son statut est "${existingOrder.status}"`,
      );
    }

    const { error, value } = updateOrderSchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    let { totalPrice } = existingOrder;

    // --- GESTION DES PRODUITS ET DU STOCK ---
    if (value.products) {
      // 1. Récupérer les infos fraîches des produits
      const docs = await Promise.all(
        value.products.map((p) => productService.getById(p.productId)),
      );

      if (docs.some((d) => !d)) {
        return handleResponse(res, 400, "Produit inexistant");
      }

      // 2. Vérification du stock "Intelligente"
      for (let i = 0; i < value.products.length; i++) {
        const newProduct = value.products[i];
        const dbProduct = docs[i];

        // On cherche si ce produit était DÉJÀ dans la commande avant modification
        const oldProductLine = existingOrder.products.find(
          (p) => p.productId.toString() === newProduct.productId,
        );
        const quantityInOrder = oldProductLine ? oldProductLine.quantity : 0;

        // Stock disponible = Ce qu'il y a en DB + Ce que je "tiens" déjà dans ma commande
        const trueAvailableStock = dbProduct.stock + quantityInOrder;

        if (newProduct.quantity > trueAvailableStock) {
          return handleResponse(
            res,
            400,
            `Quantité insuffisante pour "${dbProduct.label}". Max possible : ${trueAvailableStock}`,
          );
        }
      }

      // 3. Normalisation et calcul du nouveau prix
      const normalized = value.products.map((p, i) => ({
        productId: p.productId,
        quantity: p.quantity,
        price: docs[i].price,
      }));

      value.products = normalized;
      totalPrice = normalized.reduce((sum, p) => sum + p.price * p.quantity, 0);

      // 4. MISE À JOUR DES STOCKS DB
      // A. On remet l'ANCIEN stock en rayon (Annulation virtuelle de l'ancienne commande)
      for (const oldP of existingOrder.products) {
        const productInDb = docs.find(
          (d) => d._id.toString() === oldP.productId,
        );
        if (productInDb.stock + oldP.quantity > 0 && !productInDb.isAvailable) {
          await productService.update(oldP.productId, { available: true });
        }
        await Product.findByIdAndUpdate(oldP.productId, {
          $inc: { stock: oldP.quantity },
        });
      }

      // B. On retire le NOUVEAU stock (Application de la nouvelle commande)
      for (const newP of value.products) {
        const productInDb = docs.find(
          (d) => d._id.toString() === newP.productId,
        );
        if (productInDb.stock - newP.quantity === 0) {
          await productService.update(newP.productId, { available: false });
        }
        await Product.findByIdAndUpdate(newP.productId, {
          $inc: { stock: -newP.quantity },
        });
      }
    }
    // -----------------------------------------

    const updatedFields = {
      userId: value.userId ?? existingOrder.userId,
      products: value.products ?? existingOrder.products,
      deliveryAddress: value.deliveryAddress ?? existingOrder.deliveryAddress,
      status: value.status ?? existingOrder.status,
      totalPrice,
    };

    const updatedOrder = await orderService.update(id, updatedFields);

    if (!updatedOrder) {
      return handleResponse(res, 404, "Commande non trouvée");
    }

    updatedOrder.populate({ path: "products.productId", select: "label" });

    // Notifications mail
    const user = await userService.getUserById(updatedOrder.userId);
    if (user) {
      if (updatedFields.status === "Accepté") {
        await mailService.confirmedOrder(updatedOrder, user);
      }
      if (updatedFields.status === "Refusée") {
        const productsToRestock =
          updatedFields.products || existingOrder.products;

        for (const item of productsToRestock) {
          const productInDb = await productService.getById(item.productId);
          if (
            productInDb.stock + item.quantity > 0 &&
            !productInDb.isAvailable
          ) {
            await productService.update(item.productId, { available: true });
          }
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity }, // On AJOUTE la quantité au stock
          });
        }
        await mailService.refusedOrder(updatedOrder, user);
      }
    }

    return handleResponse(
      res,
      200,
      "Commande mise à jour avec succès",
      updatedOrder,
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    return handleResponse(res, 500, "Erreur Server");
  }
};
