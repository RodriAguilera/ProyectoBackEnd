export const checkUserAuthenticated = (req,res,next)=>{
    
    if(req.user){
        next();
    } else {
        res.render("products");
    }
};

export const showLoginView = (req,res,next)=>{

    if(req.user){
        res.render("profile");
    } else {
        next();
    }
};

export const checkRole = (roles)=>{ 
    return (req,res,next)=>{
        console.log("req", req.user.role);
        if(roles.includes(req.user.role)){
            next();
        } else {
            res.json({status:"error", message:"No tienes permisos para usar este recurso"});
        }
    }
};

export const checkAuthenticated = (req, res, next) => {
    console.log('Middleware checkAuthenticated ejecutado. isAuthenticated:', req.isAuthenticated(), 'Usuario:', req.user);
    if (req.isAuthenticated()) {
      console.log('Usuario autenticado:', req.user);
      next();
    } else {
      console.log('Usuario no autenticado');
      res.json({ status: "error", message: "Debes estar autenticado" });
    }
  };
  