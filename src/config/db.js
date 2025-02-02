const mongoose = require("mongoose");

const connect = () => {
  try {
    console.log(process.env.MONGO_URI);
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

module.exports = connect;
