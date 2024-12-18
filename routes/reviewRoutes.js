const express=require('express');
const Product=require('../models/Product');
const Review = require('../models/Review');
const {validateReview,isLoggedIn, isProductAuthor}=require('../middleware');
const router =express.Router()// mini instance
router.post('/products/:id/review',validateReview,isLoggedIn,async(req,res)=>{ //  jab y route hit hoga /products/:id/review toh validateReview middleware chalega in middleware.js file and if review validate hone ke baad error nhi aaya toh uss file m next() chalega means iss route m jo callback fun hai validateProduct middleware ke baad wo run hoga
    // console.log(req.body);
    try{
        console.log(req.params)
        let {id}=req.params;
        let {rating,comment}=req.body;
        const product= await Product.findById(id);// product find krenge with the help of id(database ke andar se product find krenge with the help of id jise review dena hai)
        const review = new Review({rating,comment});
        const newAverageRating =((product.avgRating*product.reviews.length) + parseInt(rating)) / (product.reviews.length+1);
        product.avgRating = parseFloat(newAverageRating.toFixed(1));

        product.reviews.push(review);
        
        await review.save();// save mongodb ka method hai it returns a promise and promise ki chaining se bachne ke liye we will use async and await
        await product.save();// save method is used to save (add) the document to the database
        req.flash('success','Review added successfully');// message ko flash krenge..flash a success message success(message ko flash krne ke liye req object ka use krtehai) hum flash message ko show page pr dikhayenge toh pehle productRoutes se msg ko show page pr bhejenge means uss route m msg ko pass krenge jis route pr req send krne se product show hoga(in productRoutes.js file) message is review added successfully(y message flash krana hai show page pr)
        res.redirect(`/products/${id}`);
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
        }
});

router.delete('/products/:productId/reviews/:reviewId',isLoggedIn,isProductAuthor,async (req,res)=>{
    try{
        let {productId} = req.params;
        console.log('delete reviw');
        let product = await Product.findById(productId);
        let {reviewId} =req.params;
         await Review.findByIdAndDelete(reviewId);
         await Product.findByIdAndUpdate(productId,{['$pull']:{reviews:reviewId}}, {new:true});
         req.flash('success','Reviews deleted Successfully');
         res.redirect(`/products/${productId}`);
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})

module.exports=router;