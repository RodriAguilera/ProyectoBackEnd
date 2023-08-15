import mongoose from "mongoose";
import { cartsCollection } from "../managers/mongo/index.js";

const cartSchema = new mongoose.Schema({
    products:{
        type:[],
        default:[]
    }
});

export const cartModel = mongoose.model(cartsCollection,cartSchema); 