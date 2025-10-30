const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const connect = require("./config/db");
const { swaggerUi, specs } = require("./config/swagger");
const logger = require("./utils/logger.util");

// variables d'environnement
dotenv.config();

const app = express();

// Connexion à la base de données
connect();

// config des middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // L'origine autorisée
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/authentification"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/order"));

// Démarrage du serveur
const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
