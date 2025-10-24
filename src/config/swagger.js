const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "API Au P'tit Vivo", version: "1.0.0" },
  },
  // chemins absolus pour éviter toute erreur de lecture
  apis: [
    path.join(__dirname, "../docs/routes/*.js"),
    path.join(__dirname, "../docs/models/*.js"),
  ],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
