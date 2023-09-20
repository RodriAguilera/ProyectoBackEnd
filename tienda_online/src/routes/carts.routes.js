// import { CartManager } from "../dao/managers/fileSystem/cartManager.js";
// import { ProductManager } from "../dao/managers/fileSystem/productManager.js";

// const cartService = new CartManager("carts.json");
// const productsDao = new ProductManager("products.json");

import { Router } from "express";
import { cartService, productsDao } from "../dao/index.js";


const router = Router();

router.post("/", async (req, res) => {
    try {
        const cartCreated = await cartService.save();
        res.json({ status: "success", data: cartCreated });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const allCarts = await cartService.getAll(); 
        res.render("cart", { carts: allCarts }); 
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartService.getById(cartId).populate("products.product");

        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.render("cart", { cart }); 
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        console.log(`Server - Cart ID: ${cartId}`);
        const productId = req.params.pid;

        const cart = await cartService.getById(cartId);
        const product = await productsDao.getById(productId);

        if (!cart || !product) {
            return res.json({ status: "error", message: "Carrito o producto no encontrado" });
        }

        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        if (existingProduct) {

            existingProduct.quantity += 1;
        } else {
   
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cartService.update(cartId, cart);
        
        res.json({ status: "success", message: "Producto agregado al carrito" });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await cartService.getById(cartId);
        const updatedProducts = cart.products.filter(product => product.product.toString() !== productId);
        cart.products = updatedProducts;

        await cartService.update(cartId, cart);
        res.json({ status: "success", message: "Producto eliminado del carrito" });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const newProducts = req.body.products;

        const cart = await cartService.getById(cartId);
        cart.products = newProducts;

        await cartService.update(cartId, cart);
        res.json({ status: "success", message: "Carrito actualizado con nuevos productos" });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const cart = await cartService.getById(cartId);
        const productToUpdate = cart.products.find(product => product.product.toString() === productId);
        if (productToUpdate) {
            productToUpdate.quantity = newQuantity;
            await cartService.update(cartId, cart);
            res.json({ status: "success", message: "Cantidad de producto actualizada en el carrito" });
        } else {
            res.json({ status: "error", message: "Producto no encontrado en el carrito" });
        }
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartService.getById(cartId);

        cart.products = []; 
        await cartService.update(cartId, cart);
        res.json({ status: "success", message: "Productos eliminados del carrito" });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.get("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { cart, products } = await cartService.viewCart(cartId); 
        res.render("cart", { cart, products }); 
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});



export {router as cartsRouter}