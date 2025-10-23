const secret = process.env.TOKEN_SECRET || "development";
const refreshSecret = process.env.TOKEN_REFRESH_SECRET || "development";
module.exports = {
  secret: secret,
  secretRefresh: refreshSecret,
  expiresToken: process.env.TOKEN_TIMEOUT || "1h",
  expiresRefreshToken: process.env.TOKEN_REFRESH_TIMEOUT || "7d",
  refreshSecret: refreshSecret,
};
