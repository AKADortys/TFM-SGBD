const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
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
app.use(
  express.json({
    verify: (req, res, buf) => {
      // On ne stocke le rawBody que si l'URL contient "webhook"
      if (req.originalUrl.includes("/webhook")) {
        req.rawBody = buf;
      }
    },
  }),
);

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
app.use("/config", require("./routes/config"));

// Angular
app.use(express.static(path.join(__dirname, "../front-build/browser")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-build/browser/index.html"));
});

app.set("trust proxy", 1);

module.exports = app;
