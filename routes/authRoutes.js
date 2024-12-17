// auth.js file m reviewRoutes.js file ka complete code copy kr lenge
// authentication is very important because without authentication means without signup and login hum kisi bhi cheez ko access nhi kr sakte
const express=require('express');
const User = require('../models/User');
const passport=require('passport');
const router =express.Router()// mini instance
const {validateUser}=require('../middleware');
// har router m try catch ka use krenge to handle the error

//1st route= to show the signup form 
router.get('/register',(req,res)=>{
    res.render('auth/signup');// jab user /register url pr req send krenga toh res m signup page render hoga show hoga
})

// 2nd route= want to register a user in my DB means user ko database m register krna chahte hai (user ko database m add krna chahte hai)
// jab user signup form fill krne ke baad signup button pr click krega toh post req jayegi and sara data body object m aa jayega
router.post('/register',async(req,res)=>{// register ke liye we will use register method
    // validateUser ko ,validateUser /register ke baad pass krenge
    // console.log(req.body);
    try{
        let {email,username,password,role}=req.body;// body object se form ke data ko destructure kr lenge
        console.log(username);
        console.log(username.length);
        const user= new User({email,username,role}); // new User create krenge(but new user ko create krte time password nhi bhejenge)
        const newUser = await User.register(user,password); // newuser ko database m register kr denge(means users ke collections(User ke model ) m users ke db m add kr denge) by using register method(to check user db m register hua hai ya nhi run the commnad on mongoshell=> db.users.find({}))...register method m 3 parameters pass krte hai register(user,password,cb) but callback function optional hota hai
        // User model means user ke database pr register method apply kiya hai so we will use async await
        // res.send(newUser);// res m newuser ka data bhej rhe hai
        // register is a static method and static method ko schema (mean smodel) pr apply kr sakte hai
        // res.redirect('/login');// signup button pr click krne ke baad login page pr redirect ho jayenge
        req.login(newUser,function(err){
            if(err){
                return next(err);
            }
            req.flash('success','welcome,you are registered successfully');
            return res.redirect('/products');
        });// hum chahte hai user register/signup krne ke baad automatically login ho jaye and products pr redirect ho jaye so we will use login()...means signup button pr click krne ke baad user automatically login ho jayega
    }
    catch(e){
        // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
        req.flash('error',e.message);
        return res.redirect('/register');
        // res.status(500).render('error',{err:e.message});
    }
})
// 3rd route= to show the login form
router.get('/login',(req,res)=>{
    res.render('auth/login');// jab user /login url pr req send krenga toh res m login page render hoga show hoga
})

// 4th route= login with the help of db
// passport ke andar authenticate method hota hai login m authenticate krte h.....authentication krne ke liye(means login krne ke liye) we will use authenticate method(passport documentation m middleware m)
// login ke liye means authentication ke liye we will use authenticate method  .../login ke baad validateUser middleware likenge
router.post('/login',
    passport.authenticate('local', { // copy authenticate method from documentation ...passport ke method ko use kr rhe hai for authentication so passport ko require krenge in authRoutes
        failureRedirect: '/login',
        failureMessage: true }),
    (req,res)=>{
        console.log(req.user);// req ke andar user ka object hota hai and iss object ke andar currentuser jisne abhi login kiya hai uski sari information means sara data hota hai
        
    req.flash('success',`Welcome back ${req.user.username}`);
    res.redirect('/products');// login krne ke baad products page pr redirect ho jayenge
// jab login button pr click krenge toh products page pr redirect ho jayenge
})

// 5th route= logout
// logout ke liye logout method ka use krenge..y method passport ke andar hai
router.get('/logout',(req,res)=>{
    ()=>{
        req.logout();// logout ke liye we will use logout method
    };
        req.flash('success','You have successfully logout');
        res.redirect('/login');//logout krne ke baad login page pr redirect ho jyenge

})
// logout krne ke baad session se bhar aane ke liye hum server ko again restart krenge means ctrl+c then npm start
module.exports=router;// router ko export kr rhe hai toh app.js file ke andar require krenge

// buyer and seller ....buyer cannot edit , add and delete a product but seller can do all the crud operations seller can add , edit and delete a product so we want buyer ko new edit and delete button show na ho but seller ko sab kuch show ho sabhi button show ho
// buyer and seller dono ko login krna padega jab tak seller signup nhi krega login nhi krega wo bhi edit,delete and add nhi kr sakta 
// new , edit and add button ko hide kr denge for buyer if user ka role buyer hai then he cannot see the these buttons but seller can see all these buttons
// jo seller hoga use new , edit and delete sabhi button show honge ...seller have access
// but jo buyer hoga means client use  only view product button and add review button show hoga (use new, edit and delete button show nhi honge) because he dont have access buyer can view product and give reviews to the product
// forgot password(means reset password) ke liye there is a npm package nodemailer
