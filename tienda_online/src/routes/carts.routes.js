import { Router } from "express";
import { CartManager } from "../dao/cartManager.js";
import { ProductManager } from "../dao/productManager.js";

const cartService = new CartManager("carts.json");
const productService = new ProductManager("products.json");

const router = Router();

router.post("/", async(req,res)=>{
    try {
        const cartCreated = await cartService.save();
        res.json({status:"success", data:cartCreated});
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartService.getById(cartId);
        res.json({ status: "success", data: cart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartService.getById(cartId);
        const product = await productService.getProductById(productId);

        const existingProduct = cart.products.find((p) => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            const newProduct = {
                product: productId,
                quantity: 1,
            };
            cart.products.push(newProduct);
        }

        await cartService.update(cartId, cart);

        res.json({ status: "success", data: cart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});


export {router as cartsRouter}