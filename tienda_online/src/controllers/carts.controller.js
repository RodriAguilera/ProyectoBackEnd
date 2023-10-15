import {CartsService} from "../services/carts.service.js";
import {ProductsService} from "../services/products.service.js";
import { addLogger } from "../helpers/logger.js";



export class CartsController {
    static createCart = async(req, res) => {
        try {
            const newCart = {};
            const cartCreated = await CartsService.createCart(newCart);
            res.json({ status: "success", data: cartCreated });
        } catch (error) {
            const logger = addLogger();
            logger.error(`Error al crear el carrito: ${error.message}`);
            res.json({ status: "error", message: "Hubo un error al crear el carrito" });
        }
    };

    static getCarts = async(req, res) => {
        try {
            const carts = await CartsService.getCarts();
            res.json({ status: "success", data: carts });
        } catch (error) {
            const logger = addLogger();
            logger.error(`Error en el listado de carritos: ${error.message}`);
            res.json({ status: "error", message: "Hubo un error en el listado de carritos" });
        }
    };


    static addProductToCart = async(req,res)=>{
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const cart = await CartsService.getCart(cartId);
            const product = await ProductsService.getProduct(productId);
            //verificar si el producto ya existe en ese carrito
            //condicion
            //si existe el producto, a ese producto a la cantidad le suman 1
            const productExist = cart.products.find(product=>product.productId === productId);
            //si no existe el producto, agregar el nuevo producto al carrito
            const newProduct = {
                productId:productId,
                quantity:1
            }
            cart.products.push(newProduct);
            //actualizar el carrito
            const cartUpdated = await CartsService.updateCart(cartId, cart);
            res.json({status:"success", data:cartUpdated});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };
}