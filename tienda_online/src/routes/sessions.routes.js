import { Router } from "express";

import passport from "passport";

import { SessionsController } from "../controllers/sessions.controller.js";

import { uploaderProfile } from "../utils.js";

const router = Router();

router.post("/signup", uploaderProfile.single("avatar") , passport.authenticate("signupStrategy", {
    failureRedirect:"/api/sessions/fail-signup"
}), SessionsController.redirectLogin);

router.get("/fail-signup", SessionsController.failSignup);

router.post("/login", passport.authenticate("loginStrategy", {
    failureRedirect: "/api/sessions/fail-login"
  }), (req, res) => {
    console.log('Información del usuario después de la autenticación:', req.user);
    SessionsController.renderProfile(req, res);
  });
  
//   router.post("/login", passport.authenticate("loginStrategy", {
//     failureRedirect:"/api/sessions/fail-login"
// }), SessionsController.renderProfile);


router.get("/fail-login", SessionsController.failLogin);

router.post("/changePass", SessionsController.changePass);

router.get("/loginGithub", passport.authenticate("githubLoginStrategy"));

router.get("/github-callback", passport.authenticate("githubLoginStrategy",{
    failureRedirect:"/api/sessions/fail-signup"
}), (req,res)=>{
    res.redirect("/perfil");
});

router.get("/logout", SessionsController.logout)


router.post("/forgot-password", SessionsController.forgotPassword);

router.post("/reset-password", SessionsController.resetPassword);

export {router as sessionsRouter};