const express = require("express")
const mongoose = require('mongoose');
const User = require("./models/user");
const path = require("path")
const bp = require("body-parser")
const exphbs = require("express-handlebars")

//configuraciones

const app = express()
app.use(express.json());
app.use(express.static("public"));

/* Conectar a MONGODB */
const uri = "mongodb+srv://benssyca123:olakase123@cluster0.ndz7ajb.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

//configuracion handlebars
app.engine(".hbs", exphbs.engine({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaultLayout: "main",
    extname: ".hbs"
}))
app.set("view engine",'.hbs');

//otras configuraciones
app.use(bp.json())
app.use(bp.urlencoded({ extended: false }))


//R
app.post('/register', async (req, res) => {
    let errors=0;

    const { email, password, confirm_password } = req.body;

    if(password != confirm_password){
        errors++;
    }
    if(password.length < 5){

        errors++;
    }
    if(password.includes(" ")){
        errors++;
    }
    if(errors> 0){
        res.redirect("/register");
    }
    else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            res.redirect("/register")
        }else{
            const user = new User({ email, password});
            user.password = await user.encryptPassword(password);
            await user.save();
            res.redirect("/register");
        }
    }
});

app.get("/register",async(req,res)=>{
    res.render("register");
})







//
app.listen(3000)
console.log("App listening in port 3000")