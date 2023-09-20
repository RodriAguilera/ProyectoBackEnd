import { usersDao } from "../dao/index.js";
import { createHash } from "../utils.js";


export class SessionsController{
    static redirectLogin = (req,res)=>{
        res.redirect("/login");
    };

    static failSignup = (req,res)=>{
        res.render("signup",{error:"No se pudo registrar el usuario, inténtalo de nuevo."});
    };

    static renderProfile = (req,res)=>{
        res.redirect("/perfil")};

    static failLogin = (req,res)=>{
        res.render("login",{error:"Credenciales invalidas"});
    };

    static changePass = async (req,res)=>{
        try {
            const form = req.body;
            const user = await usersDao.getByEmail(form.email);
            if(!user){
                return res.render("changePassword",{error:"No es posible cambiar la contraseña"});
            }
            user.password = createHash(form.newPassword);
            // console.log(user);
            await usersDao.update(user._id,user);
            return res.render("login",{message:"Contraseña restaurada"})
        } catch (error) {
            res.render("changePassword",{error:error.message});
        }
    };


    static logout = (req,res)=>{
        req.logOut(error=>{
            if(error){
                return res.render("profile",{user: req.user, error:"No se pudo cerrar la sesion"});
            } else {
                //req.session.destroy elimina la sesion de la base de datos
                req.session.destroy(error=>{
                    if(error) return res.render("profile",{user: req.session.userInfo, error:"No se pudo cerrar la sesion"});
                    res.redirect("/");
                })
            }
        })
    }}