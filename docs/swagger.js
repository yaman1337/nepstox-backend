import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path"

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "REST API for NepStox.",
      version: "1.0.0",
    }
  },

  apis: [path.join(process.cwd(), '/controllers/nepse/*.controller.js')]
});

function swaggerDoc(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("docs.json", (req, res) => {
    res.send(swaggerSpec);
  });
}

export default swaggerDoc;
