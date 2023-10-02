import { productsDao } from "../dao/index.js";

export class ProductsService{
    static getProducts = async()=>{
        return await productsDao.get();
    };

    static getProduct = async(productInfo)=>{
        return await productsDao.getProductById(productInfo);
    }

    static createProduct = async(productInfo)=>{
        return await productsDao.save(productInfo);
    };

    static updateProduct  = async(productId, updatedFields)=>{
    return await productsDao.updateProduct(productId, updatedFields);
    };

    static deleteProduct = async(productId)=>{
        
        return await productsDao.deleteProduct(productId);
    }
    
}