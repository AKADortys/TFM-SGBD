const userService = require("./user.service");
const bcrypt = require("bcrypt");

const authService = {
  login: async (email, password) => {
    try {
      const user = await userService.getUserByMail(email);
      if (!user) {
        return null;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }

      const response = { ...user._doc };
      delete response.password;
      delete response._doc;
      return response;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
};

module.exports = authService;
