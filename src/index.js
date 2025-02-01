const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const connect = require("./config/db");

dotenv.config();
const app = express();

connect();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("users", require("./routes/users"));

const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
