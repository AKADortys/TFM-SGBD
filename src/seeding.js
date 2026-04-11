require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User"); // Modèle User
const Product = require("./models/Product"); // Modèle Product
const Order = require("./models/Order"); // Modèle Order

mongoose
  .connect(process.env.MONGO_URI, {
    authSource: "admin", // nécessaire
  })
  .then(async () => {
    console.log("Connexion à MongoDB réussie");

    // vérifie si les collection contiennent des données
    if (
      (await User.countDocuments().exec()) === 0 ||
      (await Product.countDocuments().exec()) === 0
    ) {
      // Création des données de base si elles n'existent pas
      const createdUsers = await User.create([
        {
          name: "John",
          lastName: "Doe",
          phone: "0612345678",
          mail: "john.doe@example.com",
          password: "Password123",
          role: "admin",
          isActive: true,
        },
        {
          name: "Jane",
          lastName: "Smith",
          phone: "0798765432",
          mail: "jane.smith@example.com",
          password: "Password456",
          isActive: true,
        },
        {
          name: "Alice",
          lastName: "Martin",
          phone: "0688776655",
          mail: "alice.martin@example.com",
          password: "Password789",
          isActive: true,
        }
      ]);

      const createdProducts = await Product.create([
        { label: "Steak frites", description: "Un classique belge", price: 15, stock: 50, available: true, category: "Plat principal" },
        { label: "Boulets à la liégeoise", description: "Fait maison avec amour", price: 12, stock: 40, available: true, category: "Plat principal" },
        { label: "Pizza Margherita", description: "Sauce tomate, mozzarella, basilic", price: 11, stock: 30, available: true, category: "Plat principal" },
        { label: "Burger Angus", description: "Viande 100% Angus, cheddar affiné", price: 14, stock: 25, available: true, category: "Plat principal" },
        { label: "Tiramisu", description: "Dessert onctueux au café", price: 6, stock: 20, available: true, category: "Dessert" },
        { label: "Salade César", description: "Poulet grillé, sauce césar, croûtons", price: 10, stock: 15, available: true, category: "Plat principal" },
        { label: "Coca-Cola", description: "Canette 33cl", price: 2, stock: 100, available: true, category: "Boisson" }
      ]);

      // Création de commandes factices
      const orders = [
        {
          userId: createdUsers[0]._id,
          products: [
            { productId: createdProducts[0]._id, productName: createdProducts[0].label, quantity: 2, price: createdProducts[0].price },
            { productId: createdProducts[4]._id, productName: createdProducts[4].label, quantity: 2, price: createdProducts[4].price }
          ],
          deliveryAddress: "Rue de la Faim 12, Bruxelles",
          status: "Payée",
          totalPrice: (createdProducts[0].price * 2) + (createdProducts[4].price * 2)
        },
        {
          userId: createdUsers[1]._id,
          products: [
            { productId: createdProducts[1]._id, productName: createdProducts[1].label, quantity: 1, price: createdProducts[1].price },
            { productId: createdProducts[5]._id, productName: createdProducts[5].label, quantity: 1, price: createdProducts[5].price }
          ],
          deliveryAddress: "Avenue des Gourmands 45, Liège",
          status: "En attente",
          totalPrice: createdProducts[1].price + createdProducts[5].price
        },
        {
          userId: createdUsers[2]._id,
          products: [
            { productId: createdProducts[2]._id, productName: createdProducts[2].label, quantity: 3, price: createdProducts[2].price }
          ],
          deliveryAddress: "En magasin",
          status: "Terminée",
          totalPrice: createdProducts[2].price * 3
        }
      ];

      await Order.create(orders);
    }

    console.log(
      "Données de base créées avec succès\nmail:john.doe@example.com\npassword: Password123\nUtiliser ces identifiant pour le mode admin"
    );
    mongoose.connection.close();
  })
  .catch((err) => console.error("Erreur de connexion à MongoDB", err));
