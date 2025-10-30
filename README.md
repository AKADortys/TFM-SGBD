### Au P'tit Vivo Server BACK

---

````markdown
# 🥗 Au P’tit Vivo – Backend

Backend Node.js pour la plateforme de commande en ligne du service traiteur **Au P’tit Vivo**.

## 🚀 Technologies

- Node.js / Express
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Joi (validation)
- Nodemailer + EJS (templates mails)
- dotenv (variables d’environnement)
- Swagger (documentation API)

## 🧠 Fonctionnalités principales

- Authentification (inscription, connexion, reset mot de passe)
- Gestion des produits (CRUD + filtrage + disponibilité)
- Gestion des commandes (CRUD + notifications + calcul total)
- Gestion des utilisateurs (CRUD + rôles admin/client)
- Envoi automatique de mails (confirmation, validation, refus)
- Sécurisation des routes par rôles et tokens

## 🔐 Sécurité

- Hash des mots de passe (bcrypt)
- Données sensibles chiffrées
- Tokens JWT stockés en cookies HTTP-only
- Index TTL sur les tokens
- Validation des données par Joi

## 🌍 Hébergement

- Render → Serveur Node.js
- MongoDB Atlas → Base de données
- Brevo → SMTP (envoi de mails)
- Swagger → Documentation API

## ⚙️ Installation

```bash
git clone https://github.com/<username>/vivo-back.git
cd vivo-back
npm install
cp .env.example .env
npm run dev
```
````

## 🧾 Variables d’environnement

```
APP_PORT = 3000
MONGO_URI ="mongodb://root:root@localhost:27017/test"
TOKEN_SECRET = exampleTokenSecret123!@#
TOKEN_REFRESH_SECRET= exampleTokenRefreshSecret123!@#
TOKEN_TIMEOUT = "1h"
TOKEN_REFRESH_TIMEOUT = "7d"
CORS_ORIGIN = "http://localhost:5174"
SMTP_HOST="mailServer.example.com"
SMTP_USER="example@mail.com"
SMTP_PASS="password123"
SMTP_PORT=587
ADMIN_MAIL="mail@example.com"
ENCRYPTION_IV = "123456"
ENCRYPTION_KEY = "BADKEYBADKEYBADKEYBADKEYBADKEY12"
FRONT_BASE_URL="http://localhost:5174"
FRONT_LOGIN_URL="http://localhost:5174/login"
FRONT_PASSWORD_RESET_URL="http://localhost:5174/password-reset"
FRONT_ACCOUNT_CONFIRM_URL="http://localhost:5174/confirm-account"

```

## 🧪 Tests

Scénarios de test API avec Postman / Insomnia.
Tests de charge possibles via k6 ou Artillery.

## 📄 Documentation

Swagger accessible via `/api-docs` une fois le serveur lancé.

---

Développé par **Ancel Thibault (2025–2026)** dans le cadre du TFE bachelier informatique.
