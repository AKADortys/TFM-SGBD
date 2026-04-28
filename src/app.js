const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const mongoSanitize = require("express-mongo-sanitize");
const { apiLimiter } = require("./middlewares/rate-limiter.middleware");
const { swaggerUi, specs } = require("./config/swagger");
const logger = require("./utils/logger.util");

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(
  express.json({
    verify: (req, res, buf) => {
      // On ne stocke le rawBody que pour "webhook"
      if (req.originalUrl.includes("/webhook")) {
        req.rawBody = buf;
      }
    },
  }),
);

// Logger (déplacé avant la protection CSRF pour voir les requêtes bloquées)
if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}

const csrfProtection = csrf({ 
  cookie: {
    sameSite: 'lax', // Permet l'envoi du cookie en local/cross-origin simple
  }
});

// Protection CSRF avec exclusion pour les webhooks et les tests
app.use((req, res, next) => {
  if (req.originalUrl.includes("/webhook") || process.env.NODE_ENV === "test") {
    return next();
  }
  csrfProtection(req, res, next);
});

// Fourniture du token CSRF pour le frontend Angular
app.use((req, res, next) => {
  if (!req.originalUrl.includes("/webhook") && process.env.NODE_ENV !== "test") {
    res.cookie("XSRF-TOKEN", req.csrfToken(), {
      sameSite: 'lax'
    });
  }
  next();
});

// Sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "script-src-attr": ["'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "validator.swagger.io", "https:"],
      "connect-src": ["'self'", "https:", "http:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));
app.use(mongoSanitize());
app.use(apiLimiter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/authentification"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/order"));
app.use("/config", require("./routes/config"));

// Angular (temporaire !!)
app.use(express.static(path.join(__dirname, "../front-build/browser")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-build/browser/index.html"));
});

app.set("trust proxy", 1);

// Gestionnaire d'erreurs global (notamment pour CSRF)
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    logger.error(`Erreur CSRF sur ${req.method} ${req.originalUrl}`);
    return res.status(403).json({ error: 'Jeton CSRF manquant ou invalide.' });
  }
  next(err);
});

module.exports = app;
