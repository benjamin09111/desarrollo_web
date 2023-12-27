const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
},async (req,email,password, done)=>{ //done es callback

    //coincide email
    const user = await User.findOne({email})

    if(!user){
        req.flash("fail_msg","Not user found.")
        return done(null,false)
    }else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null,user);
        }else{
            req.flash("fail_msg","Incorrect password.");
            return done(null,false);
        }
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => {
        done(null, user);
    })
    .catch(err => {
        done(err);
    });
});