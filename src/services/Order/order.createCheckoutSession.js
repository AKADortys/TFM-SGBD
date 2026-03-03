const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (cartItems, userEmail) => {
  // 1. Formater les articles pour Stripe
  const line_items = cartItems.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name, // Adapte selon la structure de ton panier (ex: item.product.name)
        },
        unit_amount: Math.round(item.price * 100), // Stripe exige des centimes entiers
      },
      quantity: item.quantity,
    };
  });

  // 2. Demander à Stripe de créer la session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: line_items,
    mode: "payment",
    customer_email: userEmail, // Pré-remplit l'email du client sur la page de paiement
    success_url: `${process.env.FRONT_BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONT_BASE_URL}/cart`, // S'il annule, on le renvoie au panier
  });

  // 3. On ne renvoie que l'URL générée
  return session.url;
};

module.exports = createCheckoutSession;
