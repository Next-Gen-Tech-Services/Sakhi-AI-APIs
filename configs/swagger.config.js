const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sakhi APIs Docs",
            version: "1.0.0",
            description: "Mobile-based OTP Login/Signup for Clipverse",
        },
        servers: [
            {
                url: "https://sakhi-ai-apis.onrender.com",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
