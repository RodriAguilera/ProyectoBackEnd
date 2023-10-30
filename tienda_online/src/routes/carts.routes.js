import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { TicketsController } from "../controllers/tickets.controller.js";
import { checkRole, checkAuthenticated } from "../dao/middlewares/auth.js";

const router = Router();

router.get("/", CartsController.getCarts);
router.post("/",  checkAuthenticated, checkRole(["admin", "user"]), CartsController.createCart);

router.get("/:cid", (req,res)=>{});

router.post("/:cid/product/:pid", CartsController.addProductToCart);

router.post("/:cid/purchase", TicketsController.createTicket );

export {router as cartsRouter}