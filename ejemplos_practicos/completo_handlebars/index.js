// Import required modules
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require("./models/user");
const Transf = require("./models/transf");
const path = require("path")
const bp = require("body-parser")
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const session = require("express-session")
const passport = require("passport")
const flash = require("connect-flash")
const {isAuthenticated} = require("./helpers/auth");

function isNumeric(str) {
    return !isNaN(str);
}

// Set up Express app
const app = express();
require("./config/passport");

app.use(express.json());
app.use(express.static("public"));

//Variables de entorno
const { MONGODB_URI } = process.env;
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

//configurar express hbs
app.engine(".hbs", exphbs.engine({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaultLayout: "main",
    extname: ".hbs"
}))
app.set("view engine",'.hbs');

//Middlewares
app.use(bp.json())
app.use(bp.urlencoded({ extended: false }))
app.use(methodOverride("_method")) //debo enviarle una consulta para indicar, una query con ? ver en form boton delete
//guardar mensajes en el servidor
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Global variables
app.use((req,res,next)=>{
    res.locals.fail_msg = req.flash("fail_msg");
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

//RUTAS

//INDEX
app.get("/",async (req,res)=>{

    if(req.isAuthenticated()){
        req.flash("fail_msg","Please, logout first.");
        res.redirect("/home");
    }else res.render("index",{style: "indexstyle.css", nav: "navbarstyle.css", layout: "loginregister.hbs"});

})

//LOGOUT
app.get("/logout",isAuthenticated,(req,res)=>{
    req.logout(function(err) {
        if (err) {
            console.log(err);
        }else{
            req.flash("success_msg","You are logged out now.");
            res.redirect("/login");
        }
    });
})


//R
app.post('/register', async (req, res) => {
    let errors=0;
    const { email, password, confirm_password } = req.body;
    if(password != confirm_password){
        req.flash("fail_msg","Password do not match.");
        errors++;
    }
    if(password.length < 5){
        req.flash("fail_msg","Password must be at least 5 characters.");
        errors++;
    }
    if(password.includes(" ")){
        req.flash("fail_msg","Password musn't contain a space character.");
        errors++;
    }
    if(errors> 0){
        res.redirect("/register");
    }
    else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash("fail_msg","The email is already in use.");
            res.redirect("/register")
        }else{
            const user = new User({ email, password});
            user.password = await user.encryptPassword(password);
            await user.save();
            req.flash("success_msg","Account created successfuly.");
            res.redirect("/login");
        }
    }
});

app.get("/register",async(req,res)=>{
    if(req.isAuthenticated()){
        req.flash("fail_msg","Please, logout first.");
        res.redirect("/home");
    }else res.render("register", {style: "loginstyle.css", nav: "navbarstyle.css", layout: "loginregister.hbs"});
})

//L
app.post('/login', passport.authenticate("local",{
    failureRedirect: "/login",
    successRedirect: "/home",
    failureFlash: true
}));

app.get("/login",async(req,res)=>{
    const auth = req.isAuthenticated();

    if(auth){
        req.flash("fail_msg","Please, logout first.");
        res.redirect("/home");
    }else res.render("login", {style: "loginstyle.css", nav: "navbarstyle.css", layout: "loginregister.hbs"});
})

app.get("/home",isAuthenticated,async(req,res)=>{
    res.render("home", {style: "homestyle.css", nav: "navbarstyle.css",layout: "homelay.hbs"});
})

//VER SI TENGO DINERO SUFICIENTE, VER SI EXISTE ESE USUARIO DE DESTINO
//REEMPLAZAR MYMONEY CON EL DINERO ACTUAL DE LA SESION INICIADA-> req.session.myMoney
//PARA VER EL USUARIO ACTUAL, SIMPLEMENTE ES REQ.USER Y OBTENGO LA SESION.
app.post("/transfer/new",async(req,res)=>{
    const {amount,destiny,description} = req.body;

    if(destiny==req.user.email){
        req.flash("fail_msg",'The destiny email can\'t be yours. Use "reaload" instead.')
        res.redirect("/historial")
    }else{

        if(isNumeric(amount)){
            const myId = req.user.id;

            const u = await User.findById(myId).lean();
        
            const newMoney = parseInt(u.myMoney)-parseInt(amount);
        
            const userExist = await User.findOne({email: destiny}).lean();
        
            if(parseInt(amount) < 100){
                req.flash("fail_msg","The amount has to be more than 100.")
                res.redirect("/transfer")
            }else{
                if(parseInt(amount) > 300000){
                    req.flash("fail_msg","The amount has to be less than 300.000.")
                    res.redirect("/transfer")
                }else{
                    if(userExist){
        
                        if(newMoney >= 0){
                            const otherId = userExist._id;
                            const hisMoney = userExist.myMoney;
                            const moreMoney = parseInt(amount) + parseInt(hisMoney);
                            //disminuir mi dinero
                            await User.findByIdAndUpdate(myId, {myMoney: newMoney}); //se puede mejorar esto si ya tengo el u? para no buscar otra vez
                
                            //aumentar dinero de destino
                            await User.findByIdAndUpdate(otherId,{myMoney: moreMoney});
                
                            //agregar transferencia a mi cuenta
                            const transf1 = new Transf({name: "Money send",destiny,amount,description});
                            transf1.user = myId;

                            const des = "By "+req.user.email+": "+'"'+description+'"';
                
                            //agregar transferencia a la otra cuenta
                            const transf2 = new Transf({name: "Money recived",destiny: "My account",amount: amount,description: des});
                            transf2.user = otherId;
                
                            try{
                                transf1.save();
                                transf2.save();
                                req.flash("success_msg","Transfer realized successfully.")
                                res.redirect("/historial")
                            }catch{
                                req.flash("fail_msg","Transfer couldn't be realized.")
                                res.redirect("/historial")
                            }
                        }else{
                            req.flash("fail_msg","You don't have enough cash.");
                            res.redirect("/transfer");
                        }
                
                    }else{
                        req.flash("fail_msg","Email destiny doesn't exists.");
                        res.redirect("/transfer");
                    }
                }
            }
        }else{
            req.flash("fail_msg","The amount must be numeric.")
            res.redirect("/transfer")
        }
    }
})

//T

app.get("/transfer",isAuthenticated,(req,res)=>{
    if(req.user.card == ""){
        req.flash("fail_msg","Please, put your card number before.")
        res.redirect("/card")
    }else{
        const dinero = req.user.myMoney.toString();
        res.render("transfer", {style: "transferstyle.css", nav: "navbarstyle.css", dinero: dinero})
    }
})

//H

app.get("/historial",isAuthenticated,async (req,res)=>{
    const transfs = await Transf.find({user: req.user.id}).lean().sort({createdAt: "desc"});
    //NO LE PASO

    const card = req.user.card;
    const name = req.user.email;

    let booleano;
    if(card=="") booleano = false;
    else booleano = true;

    const dinero = req.user.myMoney.toString();
    res.render("historial",{style: "historialstyle.css", nav: "navbarstyle.css",transfs, dinero: dinero, booleano,card,name});
})

//CARD

app.post("/card",async(req,res)=>{
    const {card} = req.body;
    const id = req.user.id;

    if(isNumeric(card)){
        if(card.length > 4){
            if(card > 0){
                try{
                    await User.findByIdAndUpdate(id,{card: card});
                }catch(error){
                    req.flash("fail_msg","Card didn't save.")
                }
                res.redirect("/historial")
            }else{
                req.flash("fail_msg","Card number must be positive.")
                res.redirect("/card")
            }
        }else{
            req.flash("fail_msg","Card number must be more than four numbers.")
            res.redirect("/card")
        }
    }else{
        req.flash("fail_msg","Card number must be numeric.")
        res.redirect("/card")
    }
    
})

app.get("/card",isAuthenticated,(req,res)=>{
    res.render("card", {style: "transferstyle.css", nav: "navbarstyle.css"});
})

//R


app.post("/recharge", async(req,res)=>{
    const id = req.user.id;
    const u = await User.findById(id).lean();
    const n = req.body.amount;
    const b = u.myMoney;

    if(isNumeric(n)){
        const add = parseInt(n);
        if(add>0){
            try{
                const newMoney = b + add;
                await User.findByIdAndUpdate(id, {myMoney: newMoney});
                const newTransfer = new Transf({name: "Recharge", destiny: "My account",amount: add,description:""});
                newTransfer.user = id;
                newTransfer.save();
                req.flash("success_msg","Amount account reloaded.")
                res.redirect("/historial")
            }catch(error){
                console.log(error);
                req.flash("fail_msg","Recharge error.")
                res.redirect("/reload")
            }
        }else{
            req.flash("fail_msg","Recharge must be more than 0.")
            res.redirect("/reload")
        }
    }else{
        req.flash("fail_msg","Amount must be numeric.")
        res.redirect("/reload")
    }

})

app.get("/reload",isAuthenticated,async (req,res)=>{
    const dinero = req.user.myMoney.toString();
    res.render("reload",{style: "transferstyle.css", nav: "navbarstyle.css", dinero: dinero});
})

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));