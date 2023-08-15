import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { productsCollection } from "../managers/mongo/index.js"

//esquema de productos
const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    thumbnail:{   
         type:String,
       
    },
    category:{
        type:String,
        required:true,
        enum:["Calzado Running", "Calzado urbano"]
    },
    stock:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    }
});
productSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(productsCollection,productSchema);