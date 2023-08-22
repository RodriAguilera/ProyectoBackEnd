import { cartModel } from "../../models/carts.model.js";
import { productsModel } from "../../models/products.model.js";

export class CartsMongo {
    constructor(){
        this.model = cartModel;
    };

    async get(){
        try {
            const carts = await this.model.find();
            return carts;
        } catch (error) {
            throw error;
        }
    };

    async getAll() {
        try {
            const allCarts = await this.model.find();
            return allCarts;
        } catch (error) {
            throw error;
        }
    }

    async save(){
        try {
            const cartCreated = await this.model.create({});
            return cartCreated;
        } catch (error) {
            throw error;
        }
    };

    async update(cartId, updatedData) {
        try {
            const updatedCart = await this.model.findByIdAndUpdate(cartId, updatedData, {
                new: true,
            });
    
            if (!updatedCart) {
                throw new Error("No se pudo actualizar el carrito");
            }
    
            return updatedCart;
        } catch (error) {
            throw error;
        }
    };
    async addToCart(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const product = await productsModel.findById(productId);

            if (!product) {
                throw new Error("Producto no encontrado");
            }

            cart.products.push(product); 
            const updatedCart = await cart.save();

            return updatedCart;
        } catch (error) {
            throw error;
        }
    };
    
    async viewCart(cartId) {
        try {
            const cart = await this.model.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const products = await productsModel.find({ cart: cartId });

            return { cart, products };
        } catch (error) {
            throw error;
        }
    }
}