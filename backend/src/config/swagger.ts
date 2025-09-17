import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lab App API",
      version: "1.0.0",
      description: "API documentation for Lab App backend",
    },
    servers: [
      {
        url: "http://localhost:5001/api",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use("/api/docs", serve, setup(swaggerSpec));
}
