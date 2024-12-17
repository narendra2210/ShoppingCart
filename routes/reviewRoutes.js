// reviewRoutes.js file m ProductRoutes.js file ka complete code copy kr lenge

const express=require('express');
const Product=require('../models/Product');
const Review = require('../models/Review');
// Product model ko isliye require kr rhe hai kyunki products show krne hai toh Product model ke andar se products  find krenge and then display on the page
const {validateReview,isLoggedIn, isProductAuthor}=require('../middleware');
// app method  applicaton ka complete instance hai ise export nhi kr sakte
// we cannott write app.get and app.post here
// express provide mini instance (router) we will use router 
const router =express.Router()// mini instance
// har router m try catch ka use krenge to handle the error
// const {validateReview,isLoggedIn, isProductAuthor}=require('../middleware');
router.post('/products/:id/review',validateReview,isLoggedIn,async(req,res)=>{ //  jab y route hit hoga /products/:id/review toh validateReview middleware chalega in middleware.js file and if review validate hone ke baad error nhi aaya toh uss file m next() chalega means iss route m jo callback fun hai validateProduct middleware ke baad wo run hoga
    // console.log(req.body);
    try{
        console.log(req.params)
        let {id}=req.params;
        let {rating,comment}=req.body;
        const product= await Product.findById(id);// product find krenge with the help of id(database ke andar se product find krenge with the help of id jise review dena hai)
        // console.log(product);
        // new review banayenge means Review model ka object banayenge(because model is a js class)
        const review = new Review({rating,comment});
        // res.send('review route');

        // average rating logic
        const newAverageRating =((product.avgRating*product.reviews.length) + parseInt(rating)) / (product.reviews.length+1);
        product.avgRating = parseFloat(newAverageRating.toFixed(1));

        // humne id ki help se jo product find kiya hai uss product ki reviews array m new review ko add kr denge(reviews array m new review ko push kr denge)
        product.reviews.push(review);
        // jis product ke andar reviews daale hai uss product ko save krenge and new review ko bhi save krenge
        await review.save();// save mongodb ka method hai it returns a promise and promise ki chaining se bachne ke liye we will use async and await
        await product.save();// save method is used to save (add) the document to the database
        req.flash('success','Review added successfully');// message ko flash krenge..flash a success message success(message ko flash krne ke liye req object ka use krtehai) hum flash message ko show page pr dikhayenge toh pehle productRoutes se msg ko show page pr bhejenge means uss route m msg ko pass krenge jis route pr req send krne se product show hoga(in productRoutes.js file) message is review added successfully(y message flash krana hai show page pr)
        res.redirect(`/products/${id}`);
    // res.send('reviews stored successfully');
    // hum chahte hai page pr redirect krne ke baad uss page pr reviews show ho jo humne uss product ko diye hai...... Product ke model(database) se reviews show krne hai means dusri collection se render krna hai so we will use populate(populate means show krna)...reviews array ke andar jo objectid hai usse data populate krenge
    // hum chahte hai jab hum ek particular product ko dekhe toh uss product ke corresponding(side se) sare reviews(uss particular product ke sabhi reviews) show ho jaye(populate ho jaye)..means jab ek particular product ko show krenge toh uss product ke sath sabhi reviews bhi show kr denge(it is known as populate) toh productRoutes.js file m show product ka jo route likha tha usme Product.findById().populate('reviews') populate method add kr denge and parenthesis m reviews array ka name pass kiya hai
    // jab ek collection se dusre collection ka data chahiye so we will use populate(means hum reviews ke collection pr kaam kr rhe hai but hume products ke collection se data chahiye in that case we will use populate)
    // jo review humne diya hai use dekh sakte hai in mongosh (run the command=> db.reviews.find({})) and y dekhne ke liye ki konse product ko review diya hai then run the command in mongosh(db.products.find({}))
    }
    catch(e){
        // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
        res.status(500).render('error',{err:e.message});
        // {err:e.message}
    }
});

router.delete('/products/:productId/reviews/:reviewId',isLoggedIn,isProductAuthor,async (req,res)=>{
    try{
        let {productId} = req.params;
        console.log('delete reviw');
        // review ko delete krme ke liye sabse pehle uss product ko find krenge jiske review ko delte krna hai findById se
        let product = await Product.findById(productId);
        let {reviewId} =req.params;
         await Review.findByIdAndDelete(reviewId);
         await Product.findByIdAndUpdate(productId,{['$pull']:{reviews:reviewId}}, {new:true});
        //  Product ke database m se uss product ko find krenge jiske review ko delete krna hai then uss product ke reviews array m se uss reviewId ko delete kr denge
         // pull means to remove the element from the array .. it is a mongodb array operator
         req.flash('success','Reviews deleted Successfully');
         res.redirect(`/products/${productId}`);
    }
    catch(e){
        // console.log('error')
        res.status(500).render('error',{err:e.message});
    }
})

module.exports=router;// router ko export kr rhe hai toh app.js file ke andar require krenge