import { __dirname } from "../../../utils.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
  constructor(fileName) {
    this.path = path.join(__dirname, `/files/${fileName}`);
  };

  fileExists() {
    return fs.existsSync(this.path);
  }

  async getAll() {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(content);
        return carts;
      } else {
        throw new Error("No es posible obtener los carritos");
      }
    } catch (error) {
      throw error;
    }
  };

  async save() {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(content);
        let newId = uuidv4();
        const newCart = {
          id: newId,
          products: []
        };
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return newCart;
      } else {
        throw new Error("No es posible esta operacion");
      }
    } catch (error) {
      throw error;
    }
  };

  async getById(id) {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(content);
        const cart = carts.find(c => c.id === id);

        if (cart) {
          return cart;
        } else {
          throw new Error(`Carrito con ID ${id} no encontrado`);
        }
      } else {
        throw new Error("El archivo no existe");
      }
    } catch (error) {
      console.log(error.message);
      return undefined;
    }
  }

  async update(id, updatedFields) {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(content);
        const cartIndex = carts.findIndex(c => c.id === id);

        if (cartIndex !== -1) {
          carts[cartIndex] = { ...carts[cartIndex], ...updatedFields };
          await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
          console.log("Carrito actualizado");
          return carts[cartIndex];
        } else {
          throw new Error(`Carrito con ID ${id} no encontrado`);
        }
      }
    } catch (error) {
      throw error;
    }
  };
}
