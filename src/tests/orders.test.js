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
});
