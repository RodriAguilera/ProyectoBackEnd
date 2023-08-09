import { Router } from 'express';
// import { ProductManager } from '../dao/managers/fileSystem/productManager.js';

// const productService = new ProductManager('products.json');

import { ProductsMongo } from "../dao/managers/mongo/productsMongo.js";

const productService = new ProductsMongo();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productService.get();
        res.render('home', { products }); 
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        // const productService = new ProductManager("products.json");
        const products = await productService.get();
        res.render('realTimeProducts', { products }); 
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
})

router.get("/chat",(req,res)=>{
        res.render("chat");

} );


export { router as viewsRouter };
