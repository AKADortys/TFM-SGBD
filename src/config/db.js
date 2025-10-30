const mongoose = require("mongoose");
const logger = require("../utils/logger.util");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      authSource: "admin", // Vérifie si nécessaire
    });
    logger.info("✅ Connected to MongoDB");
  } catch (error) {
    logger.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); // Quitter l'application en cas d'échec
  }
};

// Événements pour gérer la connexion et la reconnexion
mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB disconnected! Retrying...");
  connect();
});

mongoose.connection.on("error", (err) => {
  logger.error("❌ MongoDB connection error:", err);
});

module.exports = connect;
