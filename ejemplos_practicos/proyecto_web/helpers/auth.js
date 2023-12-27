const helpers = {};

helpers.isAuthenticated = (req,res,next)=>{
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("fail_msg","Not authorized.")
    res.redirect("/login");
}

module.exports = helpers;