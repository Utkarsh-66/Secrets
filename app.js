require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const path=require("path");

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect("mongodb://0.0.0.0:27017/userDB",{useNewUrlParser:true})
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});    //for encryption we need to mongoose schema object

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});   //if we want to encrypt more field then we can add multiple values in array using ,

const User=mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });

  newUser.save()
     .then(function(){
       res.render("secrets");
     })
     .catch(function(err){
       res.send(err);
     });
});
app.post("/login",function(req,res){
  const userName=req.body.username;
  const passWord=req.body.password;

  User.findOne({email:userName})
      .then(function(data){
        if(data){                //agar mila ha kuch khali nai ha toh
          if(data.password===passWord){
            res.render("secrets");
          }else{
            res.redirect("/login");
          }
        }else{                   //else redirect karo
          res.redirect("/login");
        }
      })
      .catch(function(err){
        res.send(err);
      });
});


app.listen(3000,function(){
  console.log("Server started on port 3000!");
});
