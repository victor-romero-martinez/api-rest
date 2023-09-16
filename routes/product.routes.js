import { Router } from "express";
import { ProductController } from "../controllers/products.controllers.js";

export const createProductRouter = ({ productModel }) => {
  const productRouter = Router();

  const productController = new ProductController({ productModel });

  productRouter.get("/", productController.getAll);
  productRouter.post("/", productController.create);

  productRouter.get("/:id", productController.getById);
  productRouter.put("/:id", productController.update);
  productRouter.patch("/:id", productController.partialUpdate);
  productRouter.delete("/:id", productController.delete);

  return productRouter;
};
