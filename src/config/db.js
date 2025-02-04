const mongoose = require("mongoose");

const connect = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      authSource: "admin",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

module.exports = connect;
