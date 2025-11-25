const User = require("../../models/User");
const {
  handleServiceError,
  paginatedQuery,
  sanitizeUser,
  decrypt,
} = require("../../utils/service.util");
// Récupérer tous les utilisateurs
module.exports = async (askPage, limit, searchTerm = "") => {
  try {
    // Construction de la condition de recherche
    const searchQuery = searchTerm
      ? {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { lastName: { $regex: searchTerm, $options: "i" } },
          ],
        }
      : {};
    const { items, total, totalPages, page } = await paginatedQuery(
      User,
      searchQuery,
      askPage,
      limit
    );
    const users = items.map((user) => {
      const cleanUser = sanitizeUser(user);
      if (cleanUser.phone) {
        cleanUser.phone = decrypt(cleanUser.phone);
      }
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
