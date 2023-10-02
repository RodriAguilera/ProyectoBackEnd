import mongoose from "mongoose";

import { cartsCollection, productsCollection } from "../managers/mongo/index.js";

const cartSchema = new mongoose.Schema({
  products: [{
    productId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: productsCollection,
        required: true },
    quantity: { 
      type: Number,
      required: true, 
      default: 1 }
  }],
  default:[]
});

export const cartModel = mongoose.model(cartsCollection, cartSchema);
