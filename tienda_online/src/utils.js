import multer from "multer";
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

export const passwordValidation = async(user,password) => bcrypt.compare(password,user.password);

const checkValidFields = (body)=>{
  const {first_name, email, password} = body;
  if(!first_name || !email || !password){
      return false;
  }
  return true;
};

//filtro para nuestra carga de imagenes de perfil
const multerProfileFilter = (req,file,cb)=>{
  const valid = checkValidFields(req.body);
  if(valid){
      cb(null, true);
  } else {
      cb(null, false);
  }
}

//configuracion para guardar las imagenes de los usuarios
const profileStorage = multer.diskStorage({
  //donde voy a guardar los archivos
  destination: function(req,file,cb){
      cb(null, path.join(__dirname,"/multer/users/img"))
  },
  //con que nombre vamos a guardar el archivo.
  filename: function(req,file,cb){
      cb(null, `${req.body.email}-perfil-${file.originalname}`)
  }
});
//creamos uploader de profiles images
export const uploaderProfile = multer({storage:profileStorage, fileFilter:multerProfileFilter});


//configuracion para guardar las imagenes de los productos
const productsStorage = multer.diskStorage({
  //donde voy a guardar los archivos
  destination: function(req,file,cb){
      cb(null, path.join(__dirname,"/multer/products/img"))
  },
  //con que nombre vamos a guardar el archivo.
  filename: function(req,file,cb){
      cb(null, `${req.body.code}-product-${file.originalname}`)
  }
});
//creamos uploader de images de productos
export const uploaderProduct = multer({storage:productsStorage});


//configuracion para guardar los documentos de los usuarios
const documentsStorage = multer.diskStorage({
  //donde voy a guardar los archivos
  destination: function(req,file,cb){
      cb(null, path.join(__dirname,"/multer/users/documents"))
  },
  //con que nombre vamos a guardar el archivo.
  filename: function(req,file,cb){
      cb(null, `${req.user.email}-documento-${file.originalname}`)
  }
});
//creamos uploader de profiles images
export const uploaderDocuments = multer({storage:documentsStorage});





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


