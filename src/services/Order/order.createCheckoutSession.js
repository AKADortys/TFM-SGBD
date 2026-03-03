const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../../models/Order");

const createCheckoutSession = async (products, deliveryAddress, userId, userEmail) => {
  // 1. Sauvegarde de la commande "En attente" dans la BDD
  const totalPrice = products.reduce((total, item) => total + item.price * item.quantity, 0);

  const orderData = {
    userId,
    products: products.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    })),
    totalPrice,
    deliveryAddress,
    status: 'En attente'
  };

  const newOrder = new Order(orderData);
  const savedOrder = await newOrder.save();

  // 2. Formater les articles pour Stripe
  const line_items = products.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe exige des centimes entiers
      },
      quantity: item.quantity,
    };
  });

  // 3. Demander à Stripe de créer la session avec l'ID de commande en métadonnées
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: line_items,
    mode: "payment",
    customer_email: userEmail,
    metadata: {
      orderId: savedOrder._id.toString()
    },
    success_url: `${process.env.FRONT_BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONT_BASE_URL}/cart`,
  });

  // 4. On ne renvoie que l'URL générée
  return session.url;
};

module.exports = createCheckoutSession;
