const request = require("supertest");
const app = require("../app");
const productController = require("../controllers/product.index");

// 2. Mock des middlewares de sécurité pour contourner l'auth
jest.mock("../middlewares/jwt.middleware", () => (req, res, next) => {
  req.user = { id: "adminUser", role: "admin" }; // On simule un admin connecté
  next();
});

jest.mock("../middlewares/permissions.middleware", () => (req, res, next) => {
  next(); // On autorise tout le monde pour le test
});

// 3. Mock du contrôleur pour isoler le test des routes
jest.mock("../controllers/product.index");

describe("Routes /products", () => {
  // Reset des mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- GET /products (Liste) ---
  describe("GET /products", () => {
    it("devrait retourner la liste des produits (200)", async () => {
      const mockData = [{ _id: "1", label: "Pizza" }];
      productController.getProducts.mockImplementation((req, res) =>
        res.status(200).json(mockData),
      );

      const res = await request(app).get("/products");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(productController.getProducts).toHaveBeenCalled();
    });
  });

  // --- GET /products/:id (Détail) ---
  describe("GET /products/:id", () => {
    it("devrait retourner un produit spécifique (200)", async () => {
      const mockProduct = { _id: "123", label: "Burger" };
      productController.getById.mockImplementation((req, res) =>
        res.status(200).json(mockProduct),
      );

      const res = await request(app).get("/products/123");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockProduct);
      expect(productController.getById).toHaveBeenCalled();
    });
  });

  // --- POST /products (Création - Protégé) ---
  describe("POST /products", () => {
    it("devrait créer un produit si admin (201)", async () => {
      const newProduct = { label: "Sushi", price: 15 };
      const createdProduct = { ...newProduct, _id: "newId" };

      productController.create.mockImplementation((req, res) =>
        res.status(201).json(createdProduct),
      );

      const res = await request(app).post("/products").send(newProduct);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(createdProduct);
      expect(productController.create).toHaveBeenCalled();
    });
  });

  // --- PUT /products/:id (Mise à jour - Protégé) ---
  describe("PUT /products/:id", () => {
    it("devrait mettre à jour un produit (200)", async () => {
      const updateData = { price: 18 };
      productController.update.mockImplementation((req, res) =>
        res.status(200).json({ success: true }),
      );

      const res = await request(app).put("/products/123").send(updateData);

      expect(res.statusCode).toBe(200);
      expect(productController.update).toHaveBeenCalled();
    });
  });

  // --- DELETE /products/:id (Suppression - Protégé) ---
  describe("DELETE /products/:id", () => {
    it("devrait supprimer un produit (200)", async () => {
      productController.remove.mockImplementation((req, res) =>
        res.status(200).json({ message: "Deleted" }),
      );

      const res = await request(app).delete("/products/123");

      expect(res.statusCode).toBe(200);
      expect(productController.remove).toHaveBeenCalled();
    });
  });
});
