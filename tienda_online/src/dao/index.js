import mongoose from "mongoose";
// import { ProductManager } from "./filesystem/productManager.js";
// import { CartManager } from "./filesystem/cartManager.js";
import { ProductsMongo } from "./managers/mongo/productsMongo.js";
import { CartsMongo } from "./managers/mongo/cartsMongo.js";
import { connectDB} from "../config/dbConnection.js";

//persistencia de archivos
// const productService = new ProductManager(config.fileSystem.productsFile);


//persistencia de mongoDB
connectDB();

const productService = new ProductsMongo();
const cartService = new CartsMongo();


export {productService, cartService}