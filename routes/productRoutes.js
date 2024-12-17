const express=require('express');
const Product=require('../models/Product');
// const upload = require('../multer');
// Product model ko isliye require kr rhe hai kyunki products show krne hai toh Product model ke andar se products  find krenge and then display on the page
const {validateProduct,isLoggedIn,isSeller,isProductAuthor,validateUser}=require('../middleware');
const {showAllProducts, productForm , createProduct , showProduct , editProductForm , updateProduct , deleteProduct} =  require('../controllers/product')
const router = express.Router()// mini instance
const upload = require('../multer');

router.get('/products', showAllProducts);

router.get('/product/new', isLoggedIn, isSeller, productForm);

router.post('/products', isLoggedIn,upload.single('image'), isSeller, validateProduct, createProduct);

router.get('/products/:id', isLoggedIn, showProduct);

router.get('/products/:id/edit',isLoggedIn,isProductAuthor, editProductForm);

router.patch('/products/:id', isLoggedIn,upload.single('image'), isProductAuthor, validateProduct, updateProduct);

router.delete('/products/:id',isLoggedIn,isProductAuthor,deleteProduct);


// router.post("/uploadImage",isLoggedIn,isProductAuthor,upload);

module.exports = router;
// validateProduct middleware ko require kr rhe hai form middleware.js file
// app method  applicaton ka complete instance hai ise export nhi kr sakte
// we cant write app.get and app.post here
// express provide mini instance (router) we will use router 

// 1st route=> to show all the products
// har router m try catch block ka use krenge to handle the error
// router.get('/products',isLoggedIn,async(req,res)=>{// jab user /products pr req send krega toh sabse pehle isLoggedIn middleware chalega in middleware.js file and iss middleware m check krenge if user login hai means loggedin hai toh it will return true
//     try{
//         //1... Database m se data show krne ke liye pehle uss model(collection) ke anadr se data (products array) find krenge then data ko index page pr bhejenge
//     // 2...Product ke model(collection ) ke andar se products find krenge(means database m se data find krenge) and find() mongoose ka method hai (means db ka crud method hai) and y methods promise return krte hai ....promise ki chaining se bachne ke liye we will use async await
//     let products=await Product.find({});
//     // find method jo bhi return krega use ek products variable m store kr lenge and uss variable ko render method m object ke andar pass kr denge
//     res.render('products/index',{products});
//     // index ki file products folder ke andar hai that's why products/index
//     // render method m {} ke andar products variable pass kiya hai which means index.ejs file ke andar products data bhej rhe hai......jab user /products page pr req send krega toh response m index page show hoga and index page pr products(means y data bhej rhe hai)
//     }
//     catch(e){
//         // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
//         res.status(500).render('error',{err:e.message});
//     }

// })

// // 2nd route=> to show the form for new product
// router.get('/product/new',isLoggedIn,(req,res)=>{
//     try{
//          res.render('products/new')

//     // // response m new form show hoga
//     }

//     catch(e){
//         res.status(500).render('error',{err:e.message});
//     //     // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge


//      }
// })
// //3rd route=> to add the new product to database and then redirect to the /products page
//  //add product button pr click krte hi post request jayegi /products pr jo humne form define kiya hai in action attribute
// router.post('/products', validateProduct,isLoggedIn, isSeller, async (req,res)=>{ //  jab y route hit hoga /products toh validateProduct middleware chalega in middleware.js file and if product validate hone ke baad error nhi aaya toh uss file m next() chalega means iss route m jo callback fun hai validateProduct middleware ke baad wo run hoga
//     try{
//             // jab form submit hoga toh sara data req ki body m milega ....toh unn sabhi data ko object ke andar destructure krenge....(object ke andar vahi name likhte h jo humne schema m define kiya h)
//             let {name,img,price,desc}=req.body;  // body object ke data ko dekhne ke liye we will use the middleware app.use(express.urlencoded)
//             // database ke andar new product ko add krenge...means Product model ke andar new product create krenge and req.user object ke andar currentuser ki sari information hoti hai jo abhi login hua hai toh req.user._id se currentuser ki id(objectid) author m assign kr denge means jo user abhi loggedin hua hai uski id author m assign kr denge...toh jab hum ek new product banayenge toh usme author ki id bhi store hogi
//             await Product.create({name,img,price,desc,author:req.user._id})//  create mongodb ka method hai and y promise return krta hai to promise ki chaining se bachne ke liye we will use async and await
//             // author can be buyer or seller (login krne ke baad navabr pr uss buyer ya seller ka name show hoga jisne bhi login kiya hai)
//             // database ke andar new product add hone ke baad /products page pr redirect krenge
//             req.flash('success','Product edited successfully');
//             res.redirect('/products')// redirect means get req jayegi /products pr and sabhi products show ho jayenge with new product
//     }
//     catch(e){
//         // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
//         res.status(500).render('error',{err:e.message});
//     }
// })
// // pehle se likha hua code show ho rha hai toh enter tab
// // 4th route=> to show a particular product
// router.get('/products/:id',isLoggedIn,async(req,res)=>{
//     try{
//         // id params object se milegi toh id ko object ke andar destructure krenge
//     let {id} =req.params; // isse id mil jayegi
//     // product model ke andar se product find krenge with the help of id
//     let foundProduct= await Product.findById(id).populate('reviews'); //   product find krne ke baad use populate krenge(show krenge) reviews array ke sath means product ko show krenge reviews ke sath
//     res.render('products/show',{foundProduct,msg:req.flash('msg')});// res m show page show hoga and uss show page wo product(foundProduct) bhej rhe hai

//     }
//     catch(e){
//         // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
//         res.status(500).render('error',{err:e.message});
//     }

// })
// // if kisi chij ko show krna hai then we'll always send get request}


// // 5th route=> show the form to edit the product(particular product)
// router.get('/products/:id/edit',isLoggedIn,async(req,res)=>{ // isLoggedIn is a middleware iska use isliye kr rhe hai if user login hai tabhi products dekh sakta hai otherwsie nhi(isLoggedIn widdleware middleware.js file m banaya hai from the documentation of passport)
//     try{
//         let {id}=req.params;
//         let foundProduct= await Product.findById(id);
//         res.render('products/edit',{foundProduct});
//     }
//     catch(e){
//         // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
//         res.status(500).render('error',{err:e.message});
//     }

// })
// // product m edit kr rhe hai(form ke andar edit kr he hai) means database ke andar changes kr rhe hai so we'll send patch req because edit means partial change (partial change ke liye we'll send patch req)
// // but form ke andar patch req nhi hoti ...form can send only get or post req
// // database m changes kr rhe hai toh post req ko override kr denge patch req m with the help of method override package
// // install the package method override=> npm i method override  then require in the app.js file

// // 6th route=> to edit the product in database(means Product model m)
// // jab edit product button pr click krenge toh patch req jayegi iss url pr  /products/:id/edit
// router.patch('/products/:id',isLoggedIn,async(req,res)=>{
//     try{
//         let {id} =req.params;
//     let {name,img,price,desc}=req.body;
//     await Product.findByIdAndUpdate(id,{name,img,price,desc});// Product model(database) ke andar se uss product ko find krenge jise edit kiya hai ById and update kr denge
//     req.flash('success','Product edited successfully');// product m edit krne ke baad y success message flash hoga means display hoga/popup hoga message edited successfully
//     res.redirect(`/products/${id}`);// id ko evaluate krne ke liye backtick ka use kiya h ...product ko edit krne ke baad (means edit product button pr click krte hi usi particular product pr redirect kr jayenge jise edit kiya h isliye redirect method m uss product ki id di h)
//     }
//     catch(e){
//         // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
//         res.status(500).render('error',{err:e.message});
//     }

// })
// // 7th route=> to delete a particular product(delete krne ke liye post req ko delete req m override krenge means method override krenge and req send krne ke liye hume form ki need hoti hai so we will make delete form in the indes.ejs file)
// // database ke andar se product delete krna hai means post req jayegi but hum method override krenge...post req ko delete req m override kr denge and we will send delete request and product delete krne ke baad redirect krenge

// router.delete('/products/:id',isLoggedIn, isProductAuthor,async(req,res)=>{
//     try{
//         let {id} =req.params;
//         const product = await Product.findById(id);
//         await Product.findByIdAndDelete(id);// findByIdAndDelete jab mongodb ka y method run hoga toh iss method ke behind the scene ek middleware chalega(means mongodb ka y method behind the scene middleware chala rha hai) jo Product ke schema pr apply kiya hai in Product.js file(because product ka schema model ke andar hota hai)
//         req.flash('success','Product deleted successfully');
//         res.redirect('/products');
//     }
//     catch(e){
//         // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
//         res.status(500).render('error',{err:e.message});
//     }
// })

// module.exports=router;// router ko export kr rhe hai toh app.js file ke andar require krenge