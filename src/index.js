const dotenv = require("dotenv");
dotenv.config();
const connect = require("./config/db");
const logger = require("./utils/logger.util");
const app = require("./app");
const setupWebSocket = require("./config/websocket");

const server = setupWebSocket(app);

// Connexion à la base de données
connect();

// Démarrage du serveur
const PORT = process.env.APP_PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} (with WebSockets)`);
});
