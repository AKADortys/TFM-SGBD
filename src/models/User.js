const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "client", "moderateur"],
      default: "client",
    },
  },
  { timestamps: true }
);

// Hashage du mot de passe avant enregistrement
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Évite de hasher
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
