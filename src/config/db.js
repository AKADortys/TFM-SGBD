const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      authSource: "admin", // Vérifie si nécessaire
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); // Quitter l'application en cas d'échec
  }
};

// Événements pour gérer la connexion et la reconnexion
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected! Retrying...");
  connect();
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

module.exports = connect;
