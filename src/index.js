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
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // L'origine autorisée
    credentials: true,
  })
);
app.use(bodyParser.json());

// Routes
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/authentification"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/order"));
//remove this

app.get("/nodemailer", async (req, res) => {
  try {
    const transporter = await transporterPromise;

    const info = await transporter.sendMail({
      from: '"Au Ptit Vivo" <no-reply@example.com>',
      to: "Thibault.a@outlook.com",
      subject: "Hello ✔",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });

    res.json({
      messageId: info.messageId,
      preview: nodemailer.getTestMessageUrl(info),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'envoi du mail");
  }
});

const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
