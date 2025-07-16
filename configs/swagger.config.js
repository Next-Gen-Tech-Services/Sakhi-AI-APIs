const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Clipverse Auth API",
            version: "1.0.0",
            description: "Mobile-based OTP Login/Signup for Clipverse",
        },
        servers: [
            {
                url: "http://localhost:4000", // change if needed
            },
        ],
    },
    apis: ["./routes/*.js"], // update if your routes are elsewhere
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;