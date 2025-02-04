const userService = require("./user.service");
const bcrypt = require("bcrypt");

const authService = {
  login: async (email, password) => {
    try {
      const user = await userService.getUserByMail(email);
      if (!user) {
        throw new Error("Email ou mot de passe incorrect");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Email ou mot de passe incorrect");
      }

      const response = { ...user._doc };
      delete response.password;
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = authService;
