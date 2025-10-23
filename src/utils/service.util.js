const crypto = require("crypto");
const ejs = require("ejs");
const path = require("path");
const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY)
  .digest(); // 32 bytes pour AES-256
const ENCRYPTION_IV = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_IV)
  .digest()
  .slice(0, 16); // 16 bytes pour IV

module.exports = {
  //fonction authentification
  hashToken: (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
  //fonction token
  generateToken: (size = 48) => {
    return crypto.randomBytes(size).toString("hex");
  },
  //fonction user purifié
  sanitizeUser: (user) => {
    if (!user) return null;
    const obj = { ...user._doc };
    delete obj.password;
    return obj;
  },
  //fonction mail
  renderHtml: async (view, params) => {
    try {
      return await ejs.renderFile(view, params);
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors du rendu de la vue " + view);
    }
  },
  //fonction pour le chemin des templates
  templatePath: (file) => path.join(__dirname, "../templates", file),
  //fonction globales de service
  paginatedQuery: async (
    model,
    filter = {},
    page = Math.max(1, parseInt(page) || 1),
    limit = Math.max(1, Math.min(100, parseInt(limit) || 10)),
    sort = { createdAt: -1 },
    populate = null
  ) => {
    const skip = (page - 1) * limit;
    let query = model.find(filter).sort(sort).skip(skip).limit(limit);
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((pop) => {
          query = query.populate(pop.path, pop.select);
        });
      } else {
        query = query.populate(populate);
      }
    }
    const [items, total] = await Promise.all([
      query.exec(),
      model.countDocuments(filter),
    ]);
    return {
      items,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  },
  //fonction de chiffrement et déchiffrement
  encrypt: (text) => {
    /**
     * Chiffre une chaîne de caractères.
     * @param {string} text - Texte à chiffrer.
     * @returns {string} - Texte chiffré (hex).
     */
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      ENCRYPTION_KEY,
      ENCRYPTION_IV
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  },
  decrypt: (encryptedText) => {
    /**
     * Déchiffre une chaîne de caractères.
     * @param {string} encryptedText - Texte chiffré (hex).
     * @returns {string} - Texte déchiffré.
     */
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      ENCRYPTION_KEY,
      ENCRYPTION_IV
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  },
  //gestion des erreurs
  handleServiceError: (error, message, context = {}) => {
    const log = {
      time: new Date().toISOString(),
      service: context.service || "unknown",
      operation: context.operation || "unknown",
      message: message || error.message,
      name: error.name,
      stack: error.stack,
    };
    console.error(JSON.stringify(log, null, 2));
    throw new Error(message || error.message);
  },
  //vérification d'expiration
  isExpired: (date) => {
    return date < new Date();
  },
};
