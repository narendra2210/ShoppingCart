const express=require('express');
const User = require('../models/User');
const passport=require('passport');
const router =express.Router()// mini instance
const {validateUser}=require('../middleware');


router.get('/register',(req,res)=>{
    res.render('auth/signup');// jab user /register url pr req send krenga toh res m signup page render hoga show hoga
})


router.post('/register',async(req,res)=>{// register ke liye we will use register method
    try{
        let {email,username,password,role}=req.body;// body object se form ke data ko destructure kr lenge
        console.log(username);
        console.log(username.length);
        const user= new User({email,username,role}); // new User create krenge(but new user ko create krte time password nhi bhejenge)
        const newUser = await User.register(user,password); // newuser ko database m register kr denge(means users ke collections(User ke model ) m users ke db m add kr denge) by using register method(to check user db m register hua hai ya nhi run the commnad on mongoshell=> db.users.find({}))...register method m 3 parameters pass krte hai register(user,password,cb) but callback function optional hota hai
        req.login(newUser,function(err){
            if(err){
                return next(err);
            }
            req.flash('success','welcome,you are registered successfully');
            return res.redirect('/products');
        });
    }
    catch(e){
         req.flash('error',e.message);
        return res.redirect('/register');
    }
})


router.get('/login',(req,res)=>{
    res.render('auth/login');// jab user /login url pr req send krenga toh res m login page render hoga show hoga
})


router.post('/login',
    passport.authenticate('local', { // copy authenticate method from documentation ...passport ke method ko use kr rhe hai for authentication so passport ko require krenge in authRoutes
        failureRedirect: '/login',
        failureMessage: true }),
    (req,res)=>{
        console.log(req.user);// req ke andar user ka object hota hai and iss object ke andar currentuser jisne abhi login kiya hai uski sari information means sara data hota hai
        
    req.flash('success',`Welcome back ${req.user.username}`);
    res.redirect('/products');// login krne ke baad products page pr redirect ho jayenge
})

router.get('/logout',(req,res)=>{
    ()=>{
        req.logout();// logout ke liye we will use logout method
    };
        req.flash('success','You have successfully logout');
        res.redirect('/login');//logout krne ke baad login page pr redirect ho jyenge

})

module.exports=router;