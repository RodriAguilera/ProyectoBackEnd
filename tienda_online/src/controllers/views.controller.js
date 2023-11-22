import { usersModel } from "../dao/models/users.model.js";

export class ViewsController {
  static renderHome = (req, res) => {
    res.render("home");
  };

  static renderSignup = (req, res) => {
    res.render("signup");
  };

  static renderLogin = (req, res) => {
    res.render("login");
  };

  static renderProfile = (req,res)=>{
    const user = req.user;
    res.render("profile",{user});
};

  // static renderProfile = async (req, res) => {
  //   try {
  //     let user;

  //     if (req.user._id) {
  //       // Si req.user._id está definido, utiliza findById
  //       user = await usersModel.findById(req.user._id).lean();
  //     } else if (req.user.email) {
  //       // Si req.user.email está definido, utiliza findOne por el correo electrónico
  //       user = await usersModel.findOne({ email: req.user.email }).lean();
  //     } else {
  //       // Maneja el caso en el que ni _id ni email están definidos
  //       return res.status(404).send('Usuario no encontrado');
  //     }

  //     if (!user) {
  //       // Maneja el caso en el que el usuario no se encuentra
  //       return res.status(404).send('Usuario no encontrado');
  //     }

  //     // Renderiza la vista con los datos obtenidos
  //     res.render('profile', { user });
  //   } catch (error) {
  //     // Maneja el error de alguna manera
  //     console.error(error);
  //     res.status(500).send('Error interno del servidor');
  //   }
  // };
  

  static renderForgot = (req, res) => {
    res.render("forgotPassword");
  };

  static renderResetPass = (req, res) => {
    const token = req.query.token;
    res.render("resetPassword", { token });
  };
}
