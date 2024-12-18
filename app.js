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

const cookieParser=require('cookie-parser');
const flash=require('connect-flash'); // flash means display krna
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/User');
const MongoStore=require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');

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


app.engine('ejs',ejsMate);// app ko batayenge ki ejs file ko ejsMate engine read kr rhe hai
app.set('view engine','ejs'); // express ke pass default engine present hai that is view engine and view engine ejs files ko dekh rha hai.....but hum default engine ke sath work nhi krna chahte so we'll install the engine => ejs mate(this is also a engine) hum ejs mate engine ka use krenge
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));  //body object ke data ko dekhne ke liye we will use the middleware
app.use(methodOverride('_method'));
app.use(express.json());  // json data


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
    };


app.use(session(configSession)); // session ke middleware ka use kiya hai
app.use(flash());// flash ke middleware ka use krenge (flash package)

app.use(passport.initialize());
app.use(passport.session()); //locally store krne ke liye session ka use krte h

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate())); // copy from the documentation => passport-local-mongoose npm


app.use((req,res,next)=>{  // iss middleware ka use flash message ke liye kr rhe hai
    
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})


// routes require
const productRoutes=require('./routes/productRoutes');  // isliye require kr rhe hai jisse y har incoming req ke liye path check krega .....neeche app.use(productRoutes) kiya hai
const reviewRoutes=require('./routes/reviewRoutes');
const authRoutes=require('./routes/authRoutes');
const cartRoutes=require('./routes/cartRoutes');
const productApi = require('./routes/api/productapi');
const orderRoutes = require('./routes/orderRoutes');

app.get('/',(req,res)=>{
    res.render('home');
})

app.use(productRoutes);// so that har incoming request ke liye path check hoga
app.use(reviewRoutes); // so that har incoming request ke liye path check hoga
app.use(authRoutes); // so that har incoming request ke liye path check hoga
app.use(cartRoutes);// so that har incoming request ke liye path check hoga
app.use(productApi);
app.use(orderRoutes);


const port = 8080;


app.listen(port,()=>{
    console.log(`server connected at port ${port}`);
})


