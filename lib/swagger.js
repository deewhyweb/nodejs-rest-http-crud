const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const config = require("../config.js");
module.exports = function(app) {
  const useSchema = (path, version) => (...args) =>
    swaggerUi.setup(
      swaggerJSDoc({
        // Import swaggerDefinitions
        swaggerDefinition: {
          info: {
            // API informations (required)
            title: config.applicationName, // Title (required)
            version, // Version (required)
            description: "A sample RESTful API" // Description (optional)
          },
          basePath: "/" // Base path (optional)
        },
        // Path to the API docs
        apis: path
      })
    )(...args);
  app.use(
    "/api/v1/docs",
    swaggerUi.serve,
    useSchema(["./lib/routes/v1/fruits.js"], "1.0.0")
  );
  app.use(
    "/api/v2/docs",
    swaggerUi.serve,
    useSchema(["./lib/routes/v2/fruits.js"], "2.0.0")
  );
};
