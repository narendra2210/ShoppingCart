if(process.env.NODE_ENV !=='production'){
    require('dotenv').config({path:__dirname+"/.env"});
}

const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const seedDB=require('./seed');
const ejsMate=require('ejs-mate');// ejs mate is a templating engine which is used for layout
const methodOverride =require('method-override');// iski help se post req ko patch req m override kr denge
// method override ko require krne ke baad iska miidleware likhte hai _method
const cookieParser=require('cookie-parser');
const flash=require('connect-flash'); // flash means display krna
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/User');
const MongoStore=require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
// const bodyParser = require('body-parser');
// const upload =require('./multer');
// const cloudinary = require('cloudinary');
// const multer = require('multer');

// cookie-parser npm ka package so we will install first and after that we will require
// mongoose.connect('mongodb://127.0.0.1:27017/Shopping-app')
 
const dbURL = process.env.dbURL;
mongoose.set('strictQuery',true);

mongoose.connect(dbURL) 
.then(()=>{
    console.log("DB Connected successfully") 
})
.catch((err)=>{
    console.log("DB error");
    console.log(err);
})

// ejs is a templating language
app.engine('ejs',ejsMate);// app ko batayenge ki ejs file ko ejsMate engine read kr rhe hai
app.set('view engine','ejs'); // express ke pass default engine present hai that is view engine and view engine ejs files ko dekh rha hai.....but hum default engine ke sath work nhi krna chahte so we'll install the engine => ejs mate(this is also a engine) hum ejs mate engine ka use krenge
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));  //body object ke data ko dekhne ke liye we will use the middleware
app.use(methodOverride('_method'));
app.use(express.json());  // json data
// app.use(
//     mongoSanitize({
//       onSanitize: ({ req, key }) => {
//         console.warn(`This request[${key}] is sanitized`, req);
//       },
//     }),
//   );
let secret = process.env.SECRET || 'weneedabettersecretkey';


let store = MongoStore.create({
            secret:secret,
            mongoUrl:dbURL,
            touchAfter:24*60*60
})

let configSession={ // y express-session ka middleware hai ise documentaion se copy krenge ...yahan pr dirct object ka use kiya hai
    store:store,
    secret: 'narendra',
    secret:secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true, // means hum only http ke sath kaam krenge
        expires: Date.now() + 24*7*60*60*1000,  // expires m current date batate hai so we will use Date.now()....1st jan 1970 se lekar ab tak jitna time hua hai in miliseconds(Date.now() y batata hai)
        maxAge: 24*7*60*60*1000
    }
    // cookie: { secure: true } // secure:true ka use https protocol ke liye krte hai means deploy ke time pr iska use krte hai....https is a secure protocol
  };


app.use(session(configSession)); // session ke middleware ka use kiya hai
app.use(flash());// flash ke middleware ka use krenge (flash package)
// flash means display krna(flash a message means display a message/popup a message)
// req.flash() means flash message ko routes m add krenge jin routes pr req send krne pr message ko flash krana hai then neeche jo middleware use kiya hai vo krenge for flash a success message and error message for all the templates
// passport ki cheezon ko app.js file m use krne ke liye passport ko initialise krna padega
app.use(passport.initialize());
app.use(passport.session()); //locally store krne ke liye session ka use krte h
// hum chahte hai user ko apne session ke andar serialize and deserialize kr sake so we will use these static methods from the documentation
// use static serialize and deserialize of model for passport session support
// copy both from the documentation => passport-local-mongoose npm
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate())); // copy from the documentation => passport-local-mongoose npm

// passport
// use static authenticate method of model in LocalStrategy

app.use((req,res,next)=>{  // iss middleware ka use flash message ke liye kr rhe hai
    // console.log(process.env.NAME);  // y check kr he hai ki .env file se name variable ko acess kr pa rhe hai
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
// hume message ko har page pr means har template pr flash/popup/display krana hai ...if kisi kaam ko again and again krna hai means pehle edit page pr message ko flash karana hai then show page pr then new page pr then we will use locals(means hum cheezon ko local storage m store krte hai)...locals is a part of js
// locals is a object which contain local variables and locals is available in response(res m locals object available hota hai) and they are available for the views rendered
})
// seeding database(means add data to the database)
// seedDB();
// but seedDB function ko ek baar run krne ke baad just comment krna padega otherwise y always data ko seed krta rehega means database m data add krta rahega


// routes require
const productRoutes=require('./routes/productRoutes');  // isliye require kr rhe hai jisse y har incoming req ke liye path check krega .....neeche app.use(productRoutes) kiya hai
const reviewRoutes=require('./routes/reviewRoutes');
const authRoutes=require('./routes/authRoutes');
const cartRoutes=require('./routes/cartRoutes');
const productApi = require('./routes/api/productapi');
// const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
// authroutes banayenge for signup and login
// const uploadRoutes=require('./routes/upload/uploadRoutes');


app.get('/',(req,res)=>{
    res.render('home');
})

app.use(productRoutes);// so that har incoming request ke liye path check hoga
app.use(reviewRoutes); // so that har incoming request ke liye path check hoga
app.use(authRoutes); // so that har incoming request ke liye path check hoga
app.use(cartRoutes);// so that har incoming request ke liye path check hoga
app.use(productApi);
// app.use(uploadRoutes);
// app.use(paymentRoutes);
app.use(orderRoutes);


const port = 8080;


app.listen(port,()=>{
    console.log(`server connected at port ${port}`);
})


// req means client and res means server 
// app.js file hi server hota hai
// server ko restart krne ke liye use rs command on the terminal

//WAY FORWARD FOR E-COMMERCE SITE......

// 1.Delete a Review.(done)
// 2.Remove item from cart.(done)
// 3.Uploading Images to Cloudinary using Multer Middleware.(done)
// 4.Authentication using Google,Facebook.
// 5.Search Product
// 6.Sort Product according to Price 
// 7.Add Filters
// 8.Add profile of the User.

// sign in on cloudinary account
// install the dependencies  => npm install cloudinary multer multer-storage-cloudinary


// jab hume kisi particular cheez ko show krna hai find krna hai (like kisi product ko ya kisi order ko ya commnet ko ya review ko) to hum _id ka use krte hai(By default, Mongoose adds an _id property to  schemas.)...hum req.params se uss ki _id find krte h and uss id ki help se database m se find krte hai and then show krte hai
// mongoose _id property provide krta hai to the schemas
// jab hum collection m means model m koi document create krte hai(means data) toh mongoose bydefault uss document m ek _id property add krta hai..._id means unique id jiski help se hum database m se means uss collection m se model m se kisi bhi particular document ko means data ko find kr sakte hai
// router.get('/products/productId');
// localhost:8080/products/product._id
// means hum 