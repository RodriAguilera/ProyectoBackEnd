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

//   static renderProfile = (req,res)=>{
//     const user = req.user;
//     res.render("profile",{user});
// };

  static renderProfile = async (req, res) => {
    try {
      let user;

      if (req.user._id) {
        user = await usersModel.findById(req.user._id).lean();
      } else if (req.user.email) {
        // Si req.user.email está definido, utiliza findOne por el correo electrónico
        user = await usersModel.findOne({ email: req.user.email }).lean();
      } else {
        return res.status(404).send('Usuario no encontrado');
      }

      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }

      res.render('profile', { user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  };
  

  static renderForgot = (req, res) => {
    res.render("forgotPassword");
  };

  static renderResetPass = (req, res) => {
    const token = req.query.token;
    res.render("resetPassword", { token });
  };
}
