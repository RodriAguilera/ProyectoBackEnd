import { UsersService } from "../services/users.service.js";
import { sendInactiveAccountEmail } from '../helpers/gmail.js';


export class UsersController {
  static modifyRole = async(req,res)=>{
    try {
        const userId = req.params.uid;
        //verificar si el usuario en la db
        const user = await UsersService.getUserById(userId);
        const userRole = user.role;
        //validacion del status del usuario
        if(user.documents.length>=3 && user.status === "completo"){
            //validacion del role actual y cambio
            if(userRole === "user"){
                user.role = "premium";
            } else if(userRole === "premium"){
                user.role = "user";
            } else {
                return res.json({status:"error", message:"No se puede cambiar el role de este usuario"});
            };
            await UsersService.updateUser(user._id,user);
            return res.json({status:"success", message:`El nuevo rol del usuario es ${user.role}`});
        } else {
            res.json({status:"error", message:"El usuario no ha cargado todos los documentos"});
        }
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
};

static getAllUsers = async (req, res) => {
  try {
    const users = await UsersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

  static getUser = async (req, res) => {
    try {
      const userId = req.params.uid;
      const user = await UsersService.getUserById(userId);
      if (!user) return res.status(404).send({ status: "error", error: "User not found" });
      res.send({ status: "success", payload: user });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const updateBody = req.body;
      const userId = req.params.uid;
      const user = await UsersService.getUserById(userId);
      if (!user) return res.status(404).send({ status: "error", error: "User not found" });
      const result = await UsersService.update(userId, updateBody);
      res.send({ status: "success", message: "User updated" });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  static deleteUser = async (req, res) => {
    try {
      const userId = req.params.uid;
      const result = await UsersService.deleteUser(userId);
      res.send({ status: "success", message: "User deleted" });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  static uploadDocuments = async(req,res)=>{
    try {
        const userId = req.params.uid;
        const user = await UsersService.getUserById(userId);
        // console.log(req.files);
        const identificacion = req.files?.identificacion?.[0] || null;
        const domicilio = req.files?.domicilio?.[0] || null;
        const estadoDeCuenta = req.files?.estadoDeCuenta?.[0] || null;
        // console.log(domicilio);
        const docs = [];
        if(identificacion){
            docs.push({name:"identificacion", reference:identificacion.filename});
        };
        if(domicilio){
            docs.push({name:"domicilio", reference:domicilio.filename});
        };
        if(estadoDeCuenta){
            docs.push({name:"estadoDeCuenta", reference:estadoDeCuenta.filename});
        };
        // console.log(docs);
        user.documents = docs;
        if(docs.length ===3){
            user.status = "completo";
        } else {
            user.status = "incompleto";
        };
        // console.log(user);
        const result = await UsersService.updateUser(user._id, user);
        res.json({status:"success", data:result});
    } catch (error) {
        console.log(error.message);
        res.json({status:"error", message:"No se pudo cargar los documentos"});
    }
};

static deleteInactiveUsers = async (req, res) => {
  try {
    const inactiveUsers = await UsersService.getInactiveUsers(2); 
    // Enviar correos y eliminar usuarios
    await Promise.all(
      inactiveUsers.map(async (user) => {
        await sendInactiveAccountEmail(user.email);

        await UsersService.deleteUser(user._id);
      })
    );

    res.json({ status: 'success', message: 'Usuarios inactivos eliminados' });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};
}
