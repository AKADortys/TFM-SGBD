const request = require("supertest");
const app = require("../app");
const orderController = require("../controllers/order.index");

// 1. On mock les middlewares pour simuler un utilisateur connecté
jest.mock("../middlewares/jwt.middleware", () => (req, res, next) => {
  // On simule un utilisateur "Client" standard
  req.user = { id: "client123", role: "client" };
  req.userId = "client123";
  next();
});

// On laisse passer les permissions
jest.mock("../middlewares/permissions.middleware", () => (req, res, next) => {
  next();
});

jest.mock("../middlewares/checkStoreStatus", () => (req, res, next) => {
  next();
});

jest.mock("../controllers/order.index");

describe("Routes /orders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- POST /orders (Créer une commande) ---
  describe("POST /orders", () => {
    it("devrait créer une commande avec succès (201)", async () => {
      const newOrder = {
        products: [{ productId: "p1", quantity: 2 }],
        date: "2024-02-05",
      };

      // Simulation de la réponse du contrôleur après création
      const createdOrder = {
        _id: "order1",
        ...newOrder,
        totalToken: 10,
        status: "Confirmée",
      };
      orderController.create.mockImplementation((req, res) =>
        res.status(201).json(createdOrder),
      );

      const res = await request(app).post("/orders").send(newOrder);

      expect(res.statusCode).toBe(201);
      expect(res.body._id).toBe("order1");
      expect(orderController.create).toHaveBeenCalled();
    });
  });

  // --- GET /orders/history (Historique de l'utilisateur) ---
  describe("GET /orders/history", () => {
    it("devrait récupérer les commandes de l'utilisateur connecté", async () => {
      orderController.getUserHist.mockImplementation((req, res) =>
        res.status(200).json([]),
      );
      const res = await request(app).get("/orders/history");

      expect(res.statusCode).toBe(200);
      expect(orderController.getUserHist).toHaveBeenCalled();
    });
  });

  // --- DELETE /orders/:id (Annulation) ---
  describe("DELETE /orders/:id", () => {
    it("devrait permettre d'annuler une commande", async () => {
      orderController.remove.mockImplementation((req, res) =>
        res.status(200).json({ message: "Cancelled" }),
      );

      const res = await request(app).delete("/orders/order1");

      expect(res.statusCode).toBe(200);
      expect(orderController.remove).toHaveBeenCalled();
    });
  });

  // --- POST /orders/checkout-session (Stripe Checkout) ---
  describe("POST /orders/checkout-session", () => {
    it("devrait créer une session Stripe Checkout et retourner l'URL (200)", async () => {
      const mockPayload = {
        products: [{ productId: "p1", quantity: 2, price: 10, name: "Product 1" }],
        deliveryAddress: "123 Test Street",
      };

      orderController.createCheckoutSession.mockImplementation((req, res) =>
        res.status(200).json({ message: "Session de paiement créée", data: { url: "https://checkout.stripe.com/test-url" } }),
      );

      const res = await request(app).post("/orders/checkout-session").send(mockPayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.url).toBe("https://checkout.stripe.com/test-url");
      expect(orderController.createCheckoutSession).toHaveBeenCalled();
    });
  });

  // --- POST /orders/webhook (Stripe Webhook) ---
  describe("POST /orders/webhook", () => {
    it("devrait traiter le webhook Stripe avec succès (200)", async () => {
      orderController.handleWebhook.mockImplementation((req, res) =>
        res.status(200).json({ message: "Webhook received" }),
      );

      // On simule une requête brute de webhook Stripe
      const res = await request(app)
        .post("/orders/webhook")
        .set("stripe-signature", "t=123,v1=abc")
        .send(Buffer.from(JSON.stringify({ type: "checkout.session.completed", data: {} })));

      expect(res.statusCode).toBe(200);
      expect(orderController.handleWebhook).toHaveBeenCalled();
    });
  });
});
