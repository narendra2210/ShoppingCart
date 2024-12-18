const express = require('express')
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser('you need a better secret'));

app.get('/',(req,res)=>{
    console.log(req.cookies);
    res.send(req.signedCookies);// isse res m signed cookies jayengi jo secure hai
})


app.get('/getsignedcookies',(req,res)=>{
     res.cookie('name','Narendra',{signed:true});
    res.send("cookies sent successfully")
})


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