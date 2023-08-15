import {productsModel} from "../../models/products.model.js";


export class ProductsMongo{
    constructor(){
        this.model = productsModel;
    };

    //get products
    async get(){
        try{
            const products = await this.model.find().lean();
            return products;
        }catch(error){
            console.log(error.message);
            // throw error
            throw new Error("Hubo un error al obtener los productos");
        }
    };

    async getWithPaginate(query, options){
        try {
            const result = await this.model.paginate(query, options);
            return result;
        } catch (error) {
            throw error;
        }
    }

 

    //save product
    async save(productInfo){
        try{
            const productCreated = await this.model.create(productInfo)
            return productCreated;
        }catch(error){
            console.log(error.message);
            // throw error
            throw new Error("Hubo un error al crear el producto");
        }
    };

    //actualizar producto
    async updateProduct(id, updatedProduct){
        try{
            const productUpdated = await this.model.findByIdAndUpdate(id, updatedProduct, {new:true});
            if(!productUpdated){
                throw new Error("El producto no se puede actualizar")
            }
            return productUpdated;
        }catch(error){
            console.log(error.message);
            // throw error
            throw new Error("Hubo un error al actualizar el producto");
        }
    };

    //eliminar producto
    async deleteProduct(id){
        try{
            const product = await this.get(id);
            if(product){
                await this.model.findByIdAndDelete(id);
                return "Producto eliminado"
            }
         
        }catch(error){
            console.log(error.message);
            // throw error
            throw new Error("Hubo un error al eliminar el producto");
        }
    };

    //productById
    async getProductById(id) {
        try {
            const product = await this.model.findById(id).lean();
            return product;
        } catch (error) {
            console.log(error.message);
            throw new Error("Hubo un error al obtener el producto");
        }
    }
}