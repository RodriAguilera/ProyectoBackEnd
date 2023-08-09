import { Router } from "express";
import { ProductsMongo } from "../dao/managers/mongo/productsMongo.js";

const productService = new ProductsMongo();

const router = Router();

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productService.get();

        let limitedProducts;
        if (limit) {
            limitedProducts = products.slice(0, +limit);
        } else {
            limitedProducts = products;
        }
       
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productService.getProductById(productId);

        if (product) {
            res.json({ status: "success", data: product, message: "Producto encontrado" });
        } else {
            res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const productInfo = req.body;
        const productCreated = await productService.save(productInfo);
        res.json({ status: "success", data: productCreated, message: "Producto creado" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.put("/:pid",  async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        const updatedProduct = await productService.updateProduct(productId, updatedFields);

        res.json({ status: "success", data: updatedProduct, message: "Producto actualizado" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        await productService.deleteProduct(productId);

        res.json({ status: "success", message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export { router as productsRouter };
