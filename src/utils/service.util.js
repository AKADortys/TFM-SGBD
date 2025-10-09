const crypto = require("crypto");
const ejs = require("ejs");
const path = require("path");

module.exports = {
  //fonction authentification
  hashToken: (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
  },

  generateToken: (size = 48) => {
    return crypto.randomBytes(size).toString("hex");
  },

  sanitizeUser: (user) => {
    const obj = { ...user._doc };
    delete obj.password;
    return obj;
  },

  isExpired: (date) => {
    return date < new Date();
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
  templatePath: (file) => path.join(__dirname, "../templates", file),

  //fonction globales de service
  paginatedQuery: async (
    model,
    filter = {},
    page = 1,
    limit = 5,
    sort = { createdAt: -1 }
  ) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      model.find(filter).sort(sort).skip(skip).limit(limit),
      model.countDocuments(filter),
    ]);
    return {
      items,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  },
  handleServiceError: (error, message) => {
    console.error(error);
    throw new Error(message || error.message);
  },
};
