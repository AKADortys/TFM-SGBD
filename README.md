# Au P'tit Vivo - Back-end API

[![Logo Au P'tit Vivo](https://via.placeholder.com/150/000000/FFFFFF?text=Au+P'tit+Vivo)](logo_url)

## Description

Ce dépôt contient le **back-end** de la plateforme **Au P'tit Vivo**, une API REST dédiée à la gestion des commandes pour un service traiteur. L'API permet de gérer les utilisateurs, les produits et les commandes, avec une authentification sécurisée et des notifications par email.

---

## Fonctionnalités

### **Authentification & Utilisateurs**

- Inscription et validation par email.
- Connexion via JWT (cookies sécurisés).
- Récupération de mot de passe oublié.
- Gestion des rôles (admin/client).

### **Gestion des Produits**

- CRUD complet sur les produits.
- Filtrage et gestion de la disponibilité.

### **Gestion des Commandes**

- CRUD sur les commandes.
- Filtres par statut (Confirmée, Acceptée, Refusée, Annulée).
- Calcul automatique du total.
- Notifications par email (Nodemailer + EJS).

---

## Technologies

- **Framework** : Node.js + Express.
- **Base de données** : MongoDB (Mongoose).
- **Authentification** : JWT.
- **Validation** : Joi + Mongoose.
- **Emailing** : Nodemailer + EJS.
- **Tests** : Postman/Insomnia.

---

## Prérequis

- Node.js (v16+).
- MongoDB (local ou Atlas).
- Compte SMTP (pour l'envoi d'emails).

---
