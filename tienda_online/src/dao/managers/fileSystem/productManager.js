import {__dirname} from "../../../utils.js";
import path from "path";
import fs from "fs";
import {v4 as uuidv4} from 'uuid';

export class ProductManager{
    constructor(fileName){
        this.path=path.join(__dirname,`/files/${fileName}`); 
    };

    fileExists(){
        return fs.existsSync(this.path);
    }

    async get(){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                return products;
            } else {
                throw new Error("No es posible obtener los productos");
            }
        } catch (error) {
            throw error;
        }
    };


    async save(product){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
              
                let newId = uuidv4();
                const newProduct = {
                    id:newId,
                    ...product
                };
                products.push(newProduct);
                await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'));
                return newProduct;
            } else {
                throw new Error("No es posible esta operación");
            }
        } catch (error) {
            throw error;
        }
    };

    async getProductById(id) {
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
            const product = products.find((p) => p.id === id);

            if (product) {
              return product;
            } else {
              throw new Error(`Producto con ID ${id} no encontrado`);
            }
          } else {
            throw new Error("El archivo no existe");
          }
        } catch (error) {
          console.log(error.message);
          return undefined;
        }
      }
    

async updateProduct(id, updatedFields){
    try {
        if(this.fileExists()){
            const content = await fs.promises.readFile(this.path,"utf-8");
            const products = JSON.parse(content);
            const productIndex = products.findIndex((p) => p.id === id);
            if (productIndex !== -1) {
              products[productIndex] = { ...products[productIndex], ...updatedFields };
              await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
              console.log("Producto actualizado");
              return products[productIndex];
            } else {
              throw new Error(`Producto con ID ${id} no encontrado`);
            }
        }
    } catch (error) {
        throw error;
    }
};

async deleteProduct(id) {
    try {
        if (this.fileExists()) {
            const content = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(content);
            const productIndex = products.findIndex((p) => p.id === id);

            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
                console.log("Producto eliminado");
            } else {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
        }
    } catch (error) {
        throw error;
    }
}



}