const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    swaggerDefinition: {
        info: {
            title: "Your API Title",
            description: "Your API Description",
            version: "1.0.0",
        },
    },
    apis: ["./routes/*.js"], // Path to your API routes
};

const specs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
