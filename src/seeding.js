require("dotenv").config();
const mongoose = require("mongoose");
const User = require("models/user"); // Modèle User
const Product = require("models/product"); // Modèle Product
const Order = require("models/order"); // Modèle Order

mongoose
  .connect(process.env.MONGO_URI, {
    authSource: "admin", // Vérifie si nécessaire
  })
  .then(async () => {
    console.log("Connexion à MongoDB réussie");

    // vérifie si les collection contiennent des données
    if (
      (await User.countDocuments().exec()) === 0 ||
      (await Product.countDocuments().exec()) === 0 ||
      (await Order.countDocuments().exec()) === 0
    ) {
      // Création des données de base si elles n'existent pas
      const users = [
        {
          name: "John Doe",
          lastName: "Doe",
          phone: "0612345678",
          mail: "john.doe@example.com",
          password: "Password123",
          role: "admin",
        },
        {
          name: "Jane Smith",
          lastName: "Smith",
          phone: "0798765432",
          mail: "jane.smith@example.com",
          password: "Password456",
        },
      ];
      await User.create(users);
    }

    const products = [
      {
        label: "Steak frites",
        description: "Description du produit 1",
        price: 10,
      },
      {
        label: "Saucisse comporte",
        description: "Description du produit 2",
        price: 20,
      },
      {
        label: "Pizza Margherita",
        description: "Description du produit 3",
        price: 15,
      },
      {
        label: "Burger King",
        description: "Description du produit 4",
        price: 12,
      },
    ];
    await Product.create(products);

    console.log("Données de base créées avec succès");
    mongoose.connection.close();
  })
  .catch((err) => console.error("Erreur de connexion à MongoDB", err));
