import express, { json } from "express";
import { createProductRouter } from "./routes/product.routes.js";
import { corsMiddleware } from "./middleware/cors.js";

export const createApp = ({ productModel }) => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");

  app.use("/api/products", createProductRouter({ productModel }));

  const PORT = process.env.PORT ?? 5555;

  app.listen(PORT, () => {
    console.info(`el servidor esta escuchando en: http://localhost:${PORT}`);
  });
};
