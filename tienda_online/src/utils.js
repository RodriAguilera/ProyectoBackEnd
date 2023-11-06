import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "./config/config.js";
import path from 'path';
import { fileURLToPath } from 'url';
import {faker,Faker,es,en} from "@faker-js/faker";


export const __dirname = path.dirname(fileURLToPath(import.meta.url));


export const createHash = (password) => {
  const saltRounds = 10; 
  return bcrypt.hashSync(password, saltRounds);
};

export const isValidPassword = (userDB,password)=>{
    return bcrypt.compareSync(password,userDB.password);
}

export const validateToken = (token)=>{
  try {
      const info = jwt.verify(token,config.gmail.secretToken);
      return info.email;
  } catch (error) {
      console.log("Error con el token", error.message);
      return null;
  }
};

// faker

const { database, commerce, image, string } = faker;

const generateProduct = () => {
  return {
    id: database.mongodbObjectId(),
    title: commerce.productName(),
    price: parseFloat(commerce.price()),
    stock: parseInt(string.numeric(2)),
    image: image.url(),
    code: string.alphanumeric(10),
    description: commerce.productDescription(),
  };
};

export const generateProducts = (numberOfProducts = 100) => {
  let products = [];
  for (let i = 0; i < numberOfProducts; i++) {
    const newProduct = generateProduct();
    products.push(newProduct);
  }
  return products;
};


