process.env.ENCRYPTION_KEY = "test-secret-key-32-bytes-long-required";
process.env.PHONE_KEY = "test-phone-key";

const request = require("supertest");
const app = require("../app");
const authController = require("../controllers/authentification.index");

jest.mock("../controllers/authentification.index");

// Mock des middlewares
jest.mock("../middlewares/jwt.middleware", () => (req, res, next) => {
  req.user = { id: "user123" };
  next();
});

// Important: Mock du rate-limiter pour éviter qu'il ne bloque les tests
jest.mock("../middlewares/rate-limiter.middleware", () => ({
  apiLimiter: (req, res, next) => next(),
  authLimiter: (req, res, next) => next(),
}));

describe("Routes /auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- LOGIN ---
  describe("POST /auth/login", () => {
    it("devrait connecter l'utilisateur et retourner 200", async () => {
      authController.login.mockImplementation((req, res) =>
        res.status(200).json({ message: "Login successful" }),
      );

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "test@test.com", password: "password123" });

      expect(res.statusCode).toBe(200);
      expect(authController.login).toHaveBeenCalled();
    });
  });

  // --- LOGOUT ---
  describe("POST /auth/logout", () => {
    it("devrait déconnecter l'utilisateur (200)", async () => {
      authController.logout.mockImplementation((req, res) =>
        res.status(200).json({ message: "Logged out" }),
      );

      const res = await request(app).post("/auth/logout");

      expect(res.statusCode).toBe(200);
      expect(authController.logout).toHaveBeenCalled();
    });
  });

  // --- PASSWORD RECOVERY ---
  describe("POST /auth/password-recovery", () => {
    it("devrait initier la récupération de mot de passe (200)", async () => {
      authController.passwordRecovery.mockImplementation((req, res) =>
        res.status(200).json({ message: "Email sent" }),
      );

      const res = await request(app)
        .post("/auth/password-recovery")
        .send({ email: "test@test.com" });

      expect(res.statusCode).toBe(200);
      expect(authController.passwordRecovery).toHaveBeenCalled();
    });
  });

  // --- PASSWORD RESET (CORRIGÉ) ---
  describe("POST /auth/password-reset", () => {
    it("devrait changer le mot de passe (200)", async () => {
      authController.passwordReset.mockImplementation((req, res) =>
        res.status(200).json({ message: "Password updated" }),
      );

      const res = await request(app)
        .post("/auth/password-reset") // Plus de token dans l'URL
        .send({
          token: "fake-token-123", // Le token est envoyé dans le body
          password: "newPassword123",
        });

      expect(res.statusCode).toBe(200);
      expect(authController.passwordReset).toHaveBeenCalled();
    });
  });

  // --- CONFIRM ACCOUNT (CORRIGÉ) ---
  describe("POST /auth/confirm-account", () => {
    it("devrait confirmer le compte (200)", async () => {
      authController.confirmAccount.mockImplementation((req, res) =>
        res.status(200).json({ message: "Confirmed" }),
      );

      // Changement GET -> POST et URL corrigée
      const res = await request(app)
        .post("/auth/confirm-account")
        .send({ token: "fake-token-123" });

      expect(res.statusCode).toBe(200);
      expect(authController.confirmAccount).toHaveBeenCalled();
    });
  });
});
