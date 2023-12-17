import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.js";
import { checkRole, checkAuthenticated } from "../dao/middlewares/auth.js";
import { uploaderProduct } from "../utils.js";

const router = Router();

router.get("/", ProductsController.getProducts);
router.get("/:pid", ProductsController.getProduct);

// router.post("/", checkAuthenticated, checkRole(["admin", "premium"]), uploaderProduct.single("thumbnail") , ProductsController.createProduct);

router.post(
    "/",
    (req, res, next) => {
      console.log('Middleware checkAuthenticated ejecutado:', req.user); 
      next();
    },
    checkAuthenticated,
    (req, res, next) => {
      console.log('Middleware checkRole ejecutado:', req.user); 
      next();
    },
    checkRole(["admin", "premium"]),
    uploaderProduct.single("thumbnail"),
    ProductsController.createProduct
  );
  

router.put("/:pid", checkAuthenticated, checkRole(["admin"]), ProductsController.updateProduct);
router.delete("/:pid", checkAuthenticated, checkRole(["admin", "premium"]), ProductsController.deleteProduct);
router.delete("/:pid", checkAuthenticated, checkRole(["admin", "premium"]), ProductsController.deleteProductAndNotify);


export { router as productsRouter };
