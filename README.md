**Résumé du serveur Back (Node.js / Express)**
Le serveur back assure la logique métier de la plateforme “Au P’tit Vivo”.

- **Technos principales** : Node.js, Express, MongoDB (via Mongoose), JWT, Joi, Nodemailer (EJS templates), dotenv, Swagger.
- **Architecture** :

  - `config/` : paramètres de DB, JWT, etc.
  - `controllers/` : logique métier liée aux routes.
  - `dto/` : validation et structuration des données entrantes (via Joi).
  - `middlewares/` : authentification, autorisation, vérification de rôles, rate limiting.
  - `models/` : schémas MongoDB (User, Product, Order, Token).
  - `routes/` : endpoints Express.
  - `services/` : logique métier réutilisable.
  - `templates/` : e-mails EJS.
  - `utils/` : fonctions utilitaires.
  - `index.js` : point d’entrée serveur.
  - `seeding.js` : préremplissage base de données.

- **Authentification** : Cookies HTTP + JWT.
- **Sécurité** : mots de passe hashés (bcrypt), données sensibles chiffrées, validation Joi, index TTL pour tokens.
- **Emails automatiques** : confirmation de compte, réinitialisation mot de passe, confirmation/acceptation/refus commande.
- **Hébergement** :

  - Render (Node.js API)
  - MongoDB Atlas (base de données)
  - Brevo (SMTP pour mails).

- **Documentation** : Swagger pour les endpoints, Google Docs pour les schémas et fonctions.

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
PORT=4000
MONGODB_URI=<your_mongo_uri>
JWT_SECRET=<secret>
REFRESH_SECRET=<secret>
SMTP_USER=<brevo_user>
SMTP_PASS=<brevo_pass>
SMTP_HOST=smtp.brevo.com
```

## 🧪 Tests

Scénarios de test API avec Postman / Insomnia.
Tests de charge possibles via k6 ou Artillery.

## 📄 Documentation

Swagger accessible via `/api-docs` une fois le serveur lancé.

---

Développé par **Ancel Thibault (2025–2026)** dans le cadre du TFE “Au P’tit Vivo”.

```

```
