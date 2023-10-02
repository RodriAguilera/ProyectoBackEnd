import { ProductsMongo } from "./managers/mongo/productsMongo.js";
import { CartsMongo } from "./managers/mongo/cartsMongo.js";
import { connectDB} from "../config/dbConnection.js";
import { UsersMongo } from "./managers/mongo/usersMongo.js";
import {TicketsMongo} from "./managers/mongo/ticketsMongo.js";

//persistencia de mongoDB
connectDB();

export const productsDao = new ProductsMongo();
export const usersDao = new UsersMongo();
export const ticketsDao = new TicketsMongo();
export const cartsDao = new CartsMongo();
