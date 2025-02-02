const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le prénom est requis"],
      minlength: [2, "Le prénom doit avoir au moins 2 caractères"],
      maxlength: [50, "Le prénom ne doit pas dépasser 50 caractères"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Le nom de famille est requis"],
      minlength: [2, "Le nom de famille doit avoir au moins 2 caractères"],
      maxlength: [50, "Le nom de famille ne doit pas dépasser 50 caractères"],
      trim: true,
    },
    mail: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "L'email fourni est invalide",
      },
    },
    phone: {
      type: String,
      required: [true, "Le numéro de téléphone est requis"],
      validate: {
        validator: (value) => validator.isMobilePhone(value, "fr-FR"),
        message: "Numéro de téléphone invalide",
      },
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      validate: {
        validator: (value) =>
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value),
        message:
          "Le mot de passe doit contenir au moins une lettre et un chiffre",
      },
    },
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
  if (!this.isModified("password")) return next();
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
