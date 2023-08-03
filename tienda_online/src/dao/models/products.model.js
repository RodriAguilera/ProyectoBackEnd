// "title": "Puma RS-X",
// 		"description": "Zapatillas deportivas con diseño retro y tecnología de amortiguación",
// 		"price": 74990,
// 		"category": "Calzado Running",
// 		"thumbnail": "https://www.moov.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dwd261252e/products/PU392339-16/PU392339-16-1.JPG",
// 		"code": "PMRSX456",
// 		"stock": 15,
// 		"status": true

import mongoose from "mongoose";

//nombre de la collecion de productos
const productsCollection = "products";

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
        enum:["Calzado Running"]
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

export const productsModel = mongoose.model(productsCollection,productSchema);