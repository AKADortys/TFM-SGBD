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
  templatePath: (file) => path.join(__dirname, "../templates", file),
  //fonction globales de service
  paginatedQuery: async (
    model,
    filter = {},
    page = 1,
    limit = 5,
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

  handleServiceError: (error, message) => {
    console.error(error);
    throw new Error(message || error.message);
  },
  isExpired: (date) => {
    return date < new Date();
  },
};
