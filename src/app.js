const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
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
app.use(bodyParser.json());

// Logger
if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/authentification"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/order"));

app.set("trust proxy", 1);

module.exports = app;
