const express  =require('express');
const passport= require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { error } = require('console');
const PassportLocal = require('passport-local').Strategy;


const app = express();

app.use(express.urlencoded({extended: true}));

app.use(cookieParser('mi secreto'));

app.use(session({
    secret: 'mi secreto',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());  
app.use(passport.session());

passport.use(new PassportLocal(function(username, password,done){
    if(username==="codigofacilito" && password === "12345678")
        return done(null,{id:1,name:"Cody"});

    done(null,false);
}));


passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserialized
passport.deserializeUser(function(id,done){
    done(null,{id:1, name: "Uriel"});
});



app.set('view engine','ejs');

app.get("/", (req,res,next)=> {
    if(req.isAuthenticated()) return next();

    res.redirect("/login");
}, (req,res)=>{

    //if we start show welcome 


    //else refdirect to login
    res.send("hola")
})

app.get("/login",(re,res) =>{
    //show login form
    res.render("login")

})

app.post("/login",passport.authenticate('local',{
    successRedirect:"/",
    failureredirect: "/login"
}));

app.listen(8080,()=> console.log("Server started in http://localhost:8080/login"));