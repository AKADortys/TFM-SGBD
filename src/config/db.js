const mongoose = require("mongoose");
const logger = require("../utils/logger.util");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      authSource: "admin",
    });
    logger.info("✅ Connected to MongoDB");
  } catch (error) {
    logger.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
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
