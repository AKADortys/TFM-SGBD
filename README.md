Voici une proposition de `README.md` entièrement révisée. Elle est professionnelle, structurée et reflète exactement ce qui est implémenté dans ton code (Architecture Service/Controller, Auth par Cookies, Swagger, Docker, etc.).

Tu n'as plus qu'à copier-coller ce contenu dans ton fichier `README.md`.

---

````markdown
# Au P'tit Vivo - Backend API

API RESTful pour la gestion des commandes et du catalogue du service traiteur "Au P'tit Vivo".
Ce projet sert de backend pour l'application web, gérant l'authentification, les produits, les commandes et les utilisateurs.

> **Contexte :** Projet de Travail de Fin d'Études (TFE).

## Fonctionnalités Principales

### Authentification & Sécurité

- **Système complet :** Inscription, Connexion, Déconnexion.
- **Sécurité des Tokens :** Utilisation de **JWT (Access & Refresh Tokens)** stockés exclusivement dans des **Cookies HTTP-Only** (protection contre XSS).
- **Gestion de compte :**
  - Validation de compte par email.
  - Récupération de mot de passe oublié (lien temporaire par email).
- **Rate Limiting :** Protection contre les attaques par force brute.
- **Permissions :** Système de rôles (Admin vs Client).

### Gestion des Ressources

- **Utilisateurs :** CRUD complet. Les clients gèrent leurs propres données, les admins ont une vue globale. Chiffrement des données sensibles (ex: téléphone).
- **Produits :** Gestion du catalogue (Ajout, modification, archivage de plats).
- **Commandes :**
  - Prise de commande client.
  - Suivi des statuts (En attente, Confirmée, Prête, etc.).
  - Historique des commandes.

### Notifications

- Envoi automatique d'emails transactionnels via **Brevo** (Confirmation d'inscription, Reset password, Changement de statut de commande).

### Outils Techniques

- **Documentation API :** Swagger UI intégré.
- **Validation :** Validation stricte des données entrantes avec Joi.
- **Logging :** Logs structurés avec Winston.

---

## Architecture Technique

Le projet suit une architecture en couches pour assurer la maintenabilité et la testabilité :

1.  **Routes (`/routes`)** : Définition des endpoints.
2.  **Controllers (`/controllers`)** : Gestion des requêtes HTTP et validation (Joi).
3.  **Services (`/services`)** : Logique métier pure (Business Logic).
4.  **Models (`/models`)** : Schémas de données MongoDB (Mongoose).

---

## Prérequis

- **Node.js** (v18 ou supérieur recommandé)
- **MongoDB** (Local ou Atlas)
- **Docker** (Optionnel, pour le déploiement)

---

## Installation et Configuration

### 1. Cloner le projet

```bash
git clone [https://github.com/AKADortys/TFM-SGBD.git](https://github.com/AKADortys/TFM-SGBD.git)
cd tfm-sgbd
```
````

### 2. Installer les dépendances

```bash
npm install

```

### 3. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example`. Remplissez les variables nécessaires :

```env
PORT=3000
# Base de données
MONGO_URI=mongodb+srv://...

# Sécurité & JWT
JWT_SECRET=votre_secret_tres_long
JWT_REFRESH_SECRET=votre_secret_refresh
CORS_ORIGIN=http://localhost:5173

# Emailing (Brevo)
BREVO_API_KEY=votre_api_key_brevo
EMAIL_SENDER=no-reply@auptitvivo.com

# Chiffrement DB (Téléphone, etc.)
ENCRYPTION_KEY=votre_cle_32_caracteres_hex
IV_LENGTH=16

```

### 4. Peupler la base de données (Seeding)

Pour injecter des données de test (Admin par défaut, produits factices) :

```bash
npm run seed

```

---

## ▶️ Démarrage

### Mode Développement (avec Hot-Reload)

```bash
npm run start:dev

```

### Mode Production

```bash
npm start

```

### Via Docker 🐳

Pour lancer l'API et une instance MongoDB locale sans configuration manuelle :

```bash
docker-compose up --build -d

```

---

## 📖 Documentation de l'API

Une fois le serveur lancé, la documentation interactive Swagger est accessible à l'adresse suivante :

👉 **http://localhost:3000/api-docs**

Vous pourrez y tester directement les routes (Authentification, Produits, Commandes, etc.).

---

## 🧪 Tests

Le projet utilise **Jest** et **Supertest** pour les tests unitaires et d'intégration.

Lancer les tests :

```bash
npm test

```

---

## 📂 Structure du projet

```
src/
├── config/         # Config DB, Swagger, Brevo
├── controllers/    # Logique de contrôle (Req/Res)
├── services/       # Logique métier
├── models/         # Schémas Mongoose
├── routes/         # Définitions des URLs
├── middlewares/    # Auth (JWT), Permissions, Rate-limit
├── dto/            # Data Transfer Objects (Joi schemas)
├── templates/      # Templates EJS pour les emails
├── utils/          # Loggers, Helpers
├── tests/          # Tests unitaires et d'intégration
└── index.js          # Point d'entrée de l'application

```

```

```
