const express = require('express');
const app = express();
const session=require('express-session');
// express-session is a npm package iska use session ke liye krenge...so install this package and then require in file
app.use(session({
    secret: 'keyboard cat',// secret key ki kuch bhi value ho sakti hai like secret:yashasvi
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true } // secure:true ka use https protocol ke liye krte hai means deploy ke time pr iska use krte hai....https is a secure protocol
  }));

  app.get('/',(req,res)=>{
    res.send("Welcome to session");
  })

  app.get('/viewcount',(req,res)=>{
    // req m session hota hai means req object ke andar session hota hai because jab client server pr req send krta hai toh req ke sath cookies bhi jati hai and cookies bhi session ki id store hoti hai means req object ke andar session hota hai
    if(req.session.count){
      // if req ke session ke andar count name ka variable hai means client website ko visit kr chuka hai toh count variable ko increase kr denge(browser ko refresh krne pr count inc hoga)
      // if hum server ko refresh krte hai means app.js file ko rok dete hai by ctl+c toh session expired ho jayega and count again 1 se start hoga beacuse session is a server side storage it depends on server.....for ex=> hum chatgpt us ekrte hai firstly uss pr login krte hai and chatgpt ka session 2 se 3 din m expired ho jata hai hume again login krna padta hai
      // but hum generally server ko refersh nhi krte hai otherwise sara data loss ho jayega
        req.session.count++;
    }
    else{
      // if req m session ke andar count  name ka variable nhi hai means client ne website ko visit nhi kiya hai to count variable m only 1 assign kr denge
        req.session.count=1;
    }
    res.send(`you visited the site ${req.session.count} times`);
  })

  app.get('/setname',(req,res)=>{
    req.session.username="Narendra Singh";// req ke session ke andar username set kr rhe hai and iske baad greet wale pr redirect ho jayenge
    res.redirect('/greet');

  })
  app.get('/greet',(req,res)=>{
    // if username set nhi kiya and direct greet pr req send ki toh username m anonymous aa jayega
    let {username="anonymous"}=req.session;
    res.send(`hi from ${username}`);
  })
  app.listen(8080,()=>{
    console.log("sever connected at port 8080");
  })

  // session key value pair store krta hai
  // jab client server pr req send krta hai toh server res m cookies bhi send krta hai to the client....server res m jo cookies send krta hai uss cookie m session ki id store hoti hai ....but jab client again usi url pr req send krta hai toh req ke sath cookies bhi jati hai means req ke sath cookies ka object bhi jata hai...cookies ke object m client ki information store hoti hai(we all know that cookie is a client side storage means cookies client side pr store hoti hai ..cookies are sent by the server)
  // session is a server side storage toh y server side pr thoda space occupy krta hai to store the key-value pair (session m important info store krate hai which is sensitive info)
  // jab tak session, avialable active session hai tab tak session ki id unique hogi..the moment jab session khatam hoga means session expired hoga session ki id bhi expired ho jayegi
  // har req ke sath cookies jati hai