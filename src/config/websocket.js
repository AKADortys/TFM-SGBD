const { Server } = require("socket.io");
const http = require("http");
module.exports = (app) => {
  // Création du serveur HTTP à partir de l'app Express
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });
  // Partager l'instance 'io' avec toute l'application Express
  app.set("io", io);

  // Écoute des connexions entrantes
  io.on("connection", (socket) => {
    logger.info(`Nouveau client connecté: ${socket.id}`);

    // Optionnel : l'utilisateur peut rejoindre une "room" avec son ID
    socket.on("join_user_room", (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`Client déconnecté: ${socket.id}`);
    });
  });
};
