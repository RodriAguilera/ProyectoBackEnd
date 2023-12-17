import { Router } from "express";
import { PaymentService } from "../services/payment.service.js";
import { ProductsService } from "../services/products.service.js";


const router = Router();

router.post("/payment-intents", async(req,res)=>{
    try {
        const productId = req.query.id;
        const product = await ProductsService.getProduct(productId);
        // const product = mockCart.find(elm=>elm.id === parseInt(productId));
        
        if(product){
            const paymentInfo = {
                amount:product.price,
                currency:"usd",
                metadata:{
                    userId:"ObjectId('$587328742jkshdhjasg82')",
                    address:JSON.stringify({
                        city:"Lima",
                        postalZip:"986234",
                        street:"calle Juan 123"
                    },null, 2),
                    phone:"+98712637612",
                    email:"pepe@gmail.com"
                }
            };
            const service = new PaymentService();
            const result = await service.createPaymentIntent(paymentInfo);
            console.log("result", result);
            res.json({status:"success", payload: result});
        } else {
            res.json({status:"error", error: "El producto no existe"});
        }
    } catch (error) {
        console.log(error.message);
        res.json({status:"error", error});
    }
});

export {router as paymentsRouter}