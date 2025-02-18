# Projet API REST - Gestion des Commandes

## Description

Ce projet est une API REST développée en **Node.js** avec **Express** et interagissant avec **MongoDB** via **Mongoose**. L'API permet de gérer un système de commandes avec des utilisateurs et des produits.

L'API comprend les fonctionnalités suivantes :

- Gestion des utilisateurs (CRUD)
- Gestion des produits (CRUD)
- Gestion des commandes (CRUD)
- Authentification via tokens d'accès
- Jointure des collections avec `lookup`
- Validation des données avec Mongoose
- Seeding des données avec `npm run seed`

## Technologies utilisées

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JSON Web Token (JWT)**

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone <URL_DU_REPO>
   cd <NOM_DU_REPO>
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Configurer les variables d'environnement**
   Créez un fichier `.env` et ajoutez les informations fournies dans `.env.example` et ajoutez-y votre configuration
4. **Démarrer le serveur**

   ```bash
   npm start
   ```

   Le serveur démarre par défaut sur **http://localhost:3000**.

5. **Seeder les données** (facultatif)
   ```bash
   npm run seed
   ```

## Modèles MongoDB

### Utilisateur (`User`)

```json
{
  "_id": "ObjectId",
  "name": "string",
  "lastName": "string",
  "mail": "string",
  "password": "string", // minLength: 8, upperCase:1, lowerCase:1
  "phone": "string", //format FR
  "role": "string" // facultatif
}
```

### Produit (`Product`)

```json
{
  "_id": "ObjectId",
  "label": "string",
  "description": "string",
  "price": "number"
}
```

### Commande (`Order`)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "products": [
    {
      "productId": "ObjectId",
      "quantity": "number",
      "price" : "number"
    }
  ],
  "totalPrice": "number",
  "deliveryAddress": "string",
  "status": "string" // enum "En attente","Confirmée","Prêt en magasin","Refusée","Annulée",
}
```

## Routes API

### Authentification

- `POST /users` - Inscription d'un utilisateur
- `POST /auth/login` - Connexion et obtention d'un token JWT

### Utilisateurs

- `GET /users` - Récupérer tous les utilisateurs
- `GET /users/:id` - Récupérer un utilisateur par son ID
- `PUT /users/:id` - Modifier un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur

### Produits

- `GET /products` - Récupérer tous les produits
- `GET /products/:id` - Récupérer un produit par son ID
- `POST /products` - Ajouter un produit
- `PUT /products/:id` - Modifier un produit
- `DELETE /products/:id` - Supprimer un produit

### Commandes

- `GET /orders` - Récupérer toutes les commandes avec jointure des utilisateurs et des produits
- `GET /orders/:id` - Récupérer une commande spécifique
- `POST /orders` - Créer une commande
- `PUT /orders/:id` - Modifier une commande
- `DELETE /orders/:id` - Supprimer une commande

## Sécurité et Validation

- **Authentification avec JWT** : Les routes sensibles nécessitent un token d'accès.
- **Validation des entrées** : Mongoose est utilisé pour valider les schémas des documents.
- **Middleware d'authentification** : Vérification du token pour les routes protégées.

## Fonctionnalités avancées

- **Lookup MongoDB** : Les commandes intègrent des informations détaillées sur les utilisateurs et les produits grâce à une requête d'agrégation avec `$lookup`.
