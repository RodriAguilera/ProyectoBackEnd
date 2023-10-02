import { TicketsService } from "../services/tickets.service.js";
import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";
import { v4 as uuidv4 } from 'uuid';

export class TicketsController {
    static async createTicket(req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await CartsService.getCart(cartId);
            const productsCart = cart.products;
            let purchaseProducts = [];
            let rejectedProducts = [];
            let totalAmount = 0;

            // iteramos por cada producto del carrito
            for (let i = 0; i < productsCart.length; i++) {
                const productCartItem = productsCart[i];
                const product = await ProductsService.getProduct(productCartItem.productId);

                if (productCartItem.quantity <= product.stock) {
                  
                    const purchasedProduct = {
                        productId: productCartItem.productId,
                        quantity: productCartItem.quantity,
                        price: product.price
                    };
                    purchaseProducts.push(purchasedProduct);
                    totalAmount += purchasedProduct.quantity * purchasedProduct.price;

                    product.stock -= productCartItem.quantity;
                    await ProductsService.updateProduct(product);
                } else {
                    rejectedProducts.push({
                        productId: productCartItem.productId,
                        quantity: productCartItem.quantity
                    });
                }
            }

            const newId = uuidv4(); 
            const newTicket = {
                code: newId,
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: req.user.email,
                purchasedProducts: purchaseProducts,
                rejectedProducts: rejectedProducts
            };

            const ticketCreated = await TicketsService.createTicket(newTicket);

            // productos que no se pudieron comprar
            const filteredCartProducts = productsCart.filter(productCartItem => {
                return rejectedProducts.some(rejectedProduct => rejectedProduct.productId === productCartItem.productId);
            });

            // carrito con los productos no comprados
            cart.products = filteredCartProducts;
            await CartsService.updateCart(cart);

            res.json({ status: "success", ticket: ticketCreated, rejectedProductIds: rejectedProducts.map(item => item.productId) });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
}
