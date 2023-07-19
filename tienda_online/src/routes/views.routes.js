import { Router } from 'express';
import { ProductManager } from '../dao/productManager.js';

const productService = new ProductManager('products.json');
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
        const productService = new ProductManager("products.json");
        const products = await productService.get();
        res.render('realTimeProducts', { products }); 
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
})
;

export { router as viewsRouter };
