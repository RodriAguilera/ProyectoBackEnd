import { Router } from 'express';

// import { ProductManager } from '../dao/managers/fileSystem/productManager.js';

// const productService = new ProductManager('products.json');

import { productService, cartService } from "../dao/index.js";
import { checkUserAuthenticated, showLoginView } from "../dao/middlewares/auth.js";

const router = Router();

router.get('/', async (req, res) => {
        res.render('home'); 
    
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


router.get("/products", async (req, res) => {
    try {
        const { limit = 3, page = 1, stock, sort = "asc", category } = req.query;

        const stockValue = stock === "0" ? undefined : parseInt(stock);
        if (!["asc", "desc"].includes(sort)) {
            return res.render("products", { error: "Orden no válido" });
        }
        const sortValue = sort === "asc" ? 1 : -1;
        const query = {
            ...(stockValue ? { stock: { $gte: stockValue } } : {}),
            ...(category ? { category: category } : {}),
        };

        const result = await productService.getWithPaginate(query, {
            page,
            limit,
            sort: { price: sortValue },
            lean: true,
        });
        
        const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
        const currentQueryParams = new URLSearchParams(req.query);
        currentQueryParams.delete("page");
        const currentQueryString = currentQueryParams.toString();

        const resultProductsView = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            prevPage: result.prevPage,
            hasPrevPage: result.hasPrevPage,
            prevLink: result.hasPrevPage ? `${baseUrl}/products?${currentQueryString}&page=${result.prevPage}` : null,
            nextPage: result.nextPage,
            hasNextPage: result.hasNextPage,
            nextLink: result.hasNextPage
                ? `${baseUrl}/products?${currentQueryString}&page=${result.nextPage}`
                : null,
                user:  JSON.parse(JSON.stringify(req.user)),
        };

        res.render("products", resultProductsView);
    } catch (error) {
        console.log(error.message);
        res.render("products", { error: "No es posible visualizar los datos" });
    }
});


router.get("/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productService.getProductById(productId);

        if (!product) {
            return res.render("product", { error: "Producto no encontrado" });
        }

        res.render("product", { product });
    } catch (error) {
        console.log(error.message);
        res.render("product", { error: "No es posible visualizar el producto" });
    }
});


router.get("/carts/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { cart, products } = await cartService.viewCart(cartId); 
        res.render("cart", { cart, products }); 
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


router.get("/registro",showLoginView,(req,res)=>{
    res.render("signup");
});

router.get("/login", showLoginView, (req,res)=>{
    res.render("login");
});

router.get("/perfil", checkUserAuthenticated, (req,res)=>{
    console.log(req.user);
    res.render("profile",{user: JSON.parse(JSON.stringify(req.user))});
});

router.get("/cambio-password", (req,res)=>{
    res.render("changePassword")
});



export { router as viewsRouter };
