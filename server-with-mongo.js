import { createApp } from "./app.js";
import { ProductModel } from "./models/mongoDB/mongo.model.js";

createApp({ productModel: ProductModel });
