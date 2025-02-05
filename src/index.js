const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const connect = require("./config/db");

dotenv.config();
const app = express();

connect();

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/authentification"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/order"));

const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
