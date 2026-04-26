const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const resumeCheckoutSession = async (order, userEmail) => {
  // 1. Formater les articles pour Stripe (depuis l'order existant)
  const line_items = order.products.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.productName,
        },
        unit_amount: Math.round(item.price * 100), // Stripe exige des centimes entiers
      },
      quantity: item.quantity,
    };
  });

  // 2. Demander à Stripe de créer la session avec l'ID de commande en métadonnées
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: line_items,
    mode: "payment",
    customer_email: userEmail,
    metadata: {
      orderId: order._id.toString()
    },
    success_url: `${process.env.FRONT_BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONT_BASE_URL}/order`,
  });

  return session.url;
};

module.exports = resumeCheckoutSession;
