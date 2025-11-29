const User = require("../../models/User");
const {
  handleServiceError,
  paginatedQuery,
  sanitizeUser,
  decrypt,
} = require("../../utils/service.util");

module.exports = async (askPage, limit, queryFilter) => {
  try {
    const filter = buildUserFilter(queryFilter);
    const { items, total, totalPages, page } = await paginatedQuery(
      User,
      filter,
      askPage,
      limit
    );

    const users = items.map((user) => {
      const cleanUser = sanitizeUser(user);
      if (cleanUser.phone) cleanUser.phone = decrypt(cleanUser.phone);
      return cleanUser;
    });

    return { users, total, totalPages, page };
  } catch (error) {
    handleServiceError(
      error,
      "Erreur lors de la récupération des utilisateurs",
      { service: "userService", operation: "getUsers" }
    );
  }
};

const buildUserFilter = (query = {}) => {
  const filter = {};

  if (query.search) {
    const regex = { $regex: query.search, $options: "i" };
    filter.$or = [{ name: regex }, { lastName: regex }, { mail: regex }];
  }

  if (query.isActive) {
    filter.isActive = query.isActive === true;
  }

  if (query.startDate || query.endDate) {
    const createdAt = {};

    if (query.startDate) {
      const d = new Date(query.startDate);
      if (!isNaN(d)) createdAt.$gte = d;
    }

    if (query.endDate) {
      const d = new Date(query.endDate);
      if (!isNaN(d)) createdAt.$lte = d;
    }

    if (Object.keys(createdAt).length) filter.createdAt = createdAt;
  }

  return filter;
};
