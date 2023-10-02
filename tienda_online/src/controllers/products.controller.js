import { ProductsService } from "../services/products.service.js";

export class ProductsController{
    static getProducts = async (req, res) => {
        try {
         
            const products = await ProductsService.getProducts();
            res.json({ status: "success", data:products, message: "Productos encontrados" });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };


    static getProduct = async(req,res)=>{
            try {
                const productId = req.params.pid;
                const product = await ProductsService.getProductById(productId);
        
                if (product) {
                    res.json({ status: "success", data: product, message: "Producto encontrado" });
                } else {
                    res.status(404).json({ status: "error", message: "Producto no encontrado" });
                }
            } catch (error) {
                res.status(500).json({ status: "error", message: error.message });
            }
    };

    static createProduct = async(req,res)=>{
        try {
            const productInfo = req.body;
            const productCreated = await ProductsService.createProduct(productInfo);
            res.json({ status: "success", data: productCreated, message: "Producto creado" });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }};

    static updateProduct = async(req,res)=>{
        try {
            const productId = req.params.pid;
            const updatedFields = req.body;
            const updatedProduct = await ProductsService.updateProduct(productId, updatedFields);
    
            res.json({ status: "success", data: updatedProduct, message: "Producto actualizado" });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static deleteProduct = async(req,res)=>{
        try {
            const productId = req.params.pid;
            await ProductsService.deleteProduct(productId);
    
            res.json({ status: "success", message: "Producto eliminado" });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };


};
