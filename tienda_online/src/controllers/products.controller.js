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
        //Agregar el producto
        try {
            const productInfo = req.body;
            productInfo.owner = req.user._id;
            const productCreated = await ProductsService.createProduct(productInfo);
            res.json({status:"success", data:productCreated, message:"producto creado"});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

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
            const product = await ProductsService.getProduct(productId);
            //validar que el usuario que esta intentando borrar el producto
            //Si es premium y es el creador del producto
            //Si es usuario administrador
            if((req.user.role === "premium" && product.owner.toString() === req.user._id.toString()) || req.user.role === "admin"){
                await ProductsService.deleteProduct(productId);
                return res.json({status:"success", message:"producto eliminado"});
            } else {
                return res.json({status:"error", message:"no tienes permisos"});
            }
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };


};
