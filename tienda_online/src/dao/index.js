import mongoose from "mongoose";
// import { ProductManager } from "./filesystem/productManager.js";
// import { CartManager } from "./filesystem/cartManager.js";
import { ProductsMongo } from "./managers/mongo/productsMongo.js";
import { CartsMongo } from "./managers/mongo/cartsMongo.js";
import { connectDB} from "../config/dbConnection.js";
import { UsersMongo } from "./managers/mongo/usersMongo.js";

//persistencia de archivos
// const productsDao = new ProductManager(config.fileSystem.productsFile);


//persistencia de mongoDB
connectDB();




const productsDao = new ProductsMongo();
const cartService = new CartsMongo();
export {productsDao, cartService}



export const usersDao = new UsersMongo();

