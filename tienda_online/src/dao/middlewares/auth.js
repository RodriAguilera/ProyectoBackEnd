export const checkUserAuthenticated = (req,res,next)=>{
    console.log(req.session);
    if(req.session?.userInfo){
        next();
    } else {
        res.render("products");
    }
};

export const showLoginView = (req,res,next)=>{
    console.log(req.session);
    if(req.session?.userInfo){
        res.render("profile");
    } else {
        next();
    }
};