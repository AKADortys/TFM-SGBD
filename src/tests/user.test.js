const request = require("supertest");
const app = require("../app");
const userController = require("../controllers/user.index");

// Mock sécurité: On est Admin pour avoir accès à tout
jest.mock("../middlewares/jwt.middleware", () => (req, res, next) => {
  req.user = { id: "adminId", role: "admin" };
  req.userId = "adminId";
  next();
});

jest.mock("../middlewares/permissions.middleware", () => (req, res, next) => {
  next(); // On laisse passer les permissions
});

jest.mock("../controllers/user.index");

describe("Routes /users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- INSCRIPTION (Souvent POST /users/register ou POST /users) ---
  // Vérifie ta route exacte dans routes/users.js. J'assume ici POST /users/register
  describe("POST /userscle  ar", () => {
    it("devrait créer un nouvel utilisateur (201)", async () => {
      const newUser = {
        lastname: "Doe",
        firstname: "John",
        email: "john@doe.com",
        password: "password123",
        phone: "0470000000",
      };

      userController.create.mockImplementation((req, res) =>
        res.status(201).json({ message: "User created" }),
      );

      const res = await request(app).post("/users").send(newUser);

      expect(res.statusCode).toBe(201);
      expect(userController.create).toHaveBeenCalled();
    });
  });

  // --- GET ALL USERS (Admin) ---
  describe("GET /users", () => {
    it("devrait récupérer tous les utilisateurs (200)", async () => {
      userController.getUsers.mockImplementation((req, res) =>
        res.status(200).json([{ email: "a@a.com" }]),
      );

      const res = await request(app).get("/users");

      expect(res.statusCode).toBe(200);
      expect(userController.getUsers).toHaveBeenCalled();
    });
  });

  // --- GET ONE USER ---
  describe("GET /users/:id", () => {
    it("devrait récupérer un utilisateur par ID (200)", async () => {
      userController.getById.mockImplementation((req, res) =>
        res.status(200).json({ email: "target@test.com" }),
      );

      const res = await request(app).get("/users/user123");

      expect(res.statusCode).toBe(200);
      expect(userController.getById).toHaveBeenCalled();
    });
  });

  // --- UPDATE USER ---
  describe("PUT /users/:id", () => {
    it("devrait mettre à jour un utilisateur (200)", async () => {
      userController.update.mockImplementation((req, res) =>
        res.status(200).json({ success: true }),
      );

      const res = await request(app)
        .put("/users/user123")
        .send({ firstname: "Jane" });

      expect(res.statusCode).toBe(200);
      expect(userController.update).toHaveBeenCalled();
    });
  });

  // --- DELETE USER ---
  describe("DELETE /users/:id", () => {
    it("devrait supprimer un utilisateur (200)", async () => {
      // Attention: Vérifie si ton export s'appelle 'remove' ou 'delete' dans user.index.js
      // Souvent c'est 'remove' pour éviter le mot réservé 'delete'
      if (userController.remove) {
        userController.remove.mockImplementation((req, res) =>
          res.status(200).json({ message: "Deleted" }),
        );
      } else {
        userController.delete.mockImplementation((req, res) =>
          res.status(200).json({ message: "Deleted" }),
        );
      }

      const res = await request(app).delete("/users/user123");

      expect(res.statusCode).toBe(200);
      // On vérifie l'appel dynamique
      const deleteFn = userController.remove || userController.delete;
      expect(deleteFn).toHaveBeenCalled();
    });
  });
});
