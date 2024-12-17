// cookies and session
//  2 types of storage client side and server side
// cookies are client side storage(browser) and sessions are server side storage
// we never stored important information inside the cookies because cookies are less secured..cookies m aise info store krte hai jo important na ho
// But sessions m important information(sensitive info) store krte hai like userid , password=> aisi info server side pr store hoti hai
// cookies are object(key-value pair) jab hum kisi url pr req send krte hai pehle wo cookies banata hai and again jab usi url pr req send krte h toh uss url pr req ke sath cookies bhi jati h
// cookies are used for personalized data, for session management and for tracking
// cookie-parser ka use krenge to work with the cookies(signed-cookies), to manage the cookies.....cookie-parser is a npm package so we'll install this cookie-parser package and then require in the file
// server send the cookies to the client
// current req previous req pr depend krti hai so it is stateful...means jo state previous state pr depend kkrti hai it is stateful
// jo previous state pr depend nhi krti it is stateless
// So cookies are stateful but hum cookies ka use nhi krenge hum session ka use krenge beacuse cookies are not good, they are not secured(koi bhi inspect krke data ko dekh sakta hai)
// If we wanted to use cookies then we will use signed cookies(signed cookies ke liye we will use cookie-parser)
// session are more secured in comparison to cookies...cookies are less secured so hum session ka sue krenge(session is a server side storage)
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser('you need a better secret'));
app.get('/',(req,res)=>{

    console.log(req.cookies);
    // res.send(req.cookies);// isse res m wo cookies jayengi jo secure nhi hai (means signed cookie nhi hai)
    res.send(req.signedCookies);// isse res m signed cookies jayengi jo secure hai

    // res.send("cookies");
})
// signed cookies
app.get('/getsignedcookies',(req,res)=>{
    // res m cookies hoti hai means res object ke andar cookies hoti hai because jab client server pr req send krta hai toh res m cookies bhi jati hai
    // cookie set kr rhe h
    res.cookie('name','Narendra',{signed:true});
    res.send("cookies sent successfully")
    // cookies ko secure banane ke liye we will write signed:true (it is a signed cookie)
})

// cookies send kr rhe hai
app.get('/setcookies',(req,res)=>{
    // cookies set kr rhe hai ..key-value pair
    res.cookie('mode','dark');
    res.cookie('name','Narendra');
    res.cookie('location','GLA');
    res.send('server sent you cookies');

})
// access all the cookies
app.get('/getcookies',(req,res)=> {
    let {mode,location,name}=req.cookies;
    res.send(`name is ${name},stay in ${location} and fav theme is ${mode}`);

})
app.listen('5050',()=>{
    console.log("cookies running at port 5050 ")
})
// two types ke protocol hote h..http and https
// https means secure protocol
// jo cookies humne set ki hai unhe dekhne ke liye inspect krenge and then go to << then ckick on application then go to cookies  but jab hum signed cookie ka use krte hai toh cookies m data (value) show nhi kregi inspect krne ke baad beacuse humne signed cookie ka use kiya hai and signed cookie secure hoti hai