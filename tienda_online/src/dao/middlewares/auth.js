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