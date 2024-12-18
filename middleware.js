const Product = require('./models/Product');
const passport = require('passport');
const {productSchema,reviewSchema,userSchema} =require('./schema');// productschema and reviewschema ko destructure krenge and schema.js file se require krenge dono schema ko


const isLoggedIn =(req,res,next)=>{  // user authenticate hai ya nhi (loggedin hai ya nhi means login hai ya nhi) y check krne ke liye middleware ka use krenge we will use isAuthenticated method y method boolean value return krta hai if it returns true  means user loggedin hai authenticate hai ...and if it returns false means loggedin nhi hai
    // req.xhr ka use krte h to check whether the request is ajax or not
    console.log("login")
    console.log(req.xhr); // true means xhr req send kr rhe hai
    if(req.xhr && !req.isAuthenticated()){
        return res.status(401).json({msg:'you need to login first'});
    }
    if(!req.isAuthenticated()){
        req.flash('error','please login first');// if user login nhi hai toh y err show hoga and res m login bhej show hoga
        return res.redirect('/login');
    }
    next();
};


const validateProduct=(req,res,next)=>{
    console.log("validate");
    let { name, price, desc } = req.body;
    console.log(req.body); // Log the request body
    const { error } = productSchema.validate({ name, price, desc });
    console.log(error); // Log any validation errors
    
       if(error){
        console.log("error in edit form")
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    
    next();
};



const validateReview=(req,res,next)=>{
    console.log("inside validate middleware")
    console.log(req.body);
    const {rating,comment}=req.body;
    const {error} = reviewSchema.validate({rating,comment}); // review k eschema ko validate kr rhe hai
    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    
    next();// next() means err nhi aaya and review validate ho chuka hai toh ab aage badh jao means validateReview middleware ke baad jo callback function hai(in reviewRoutes.js file) use run kro jo routes m pass kiya hai(/products ke routes m)

}


const isSeller = (req,res,next)=>{
    console.log("enter")
    if(!req.user.role){   // if user ka koi role nhi hai then he dont have access to do anything 
        req.flash('error','You dont have the permission to do that');
        return res.redirect('/products');
    }
    else if(req.user.role !== 'seller'){ // if user ka role hai but role seller nhi hai(means buyer hai means client) then he dont have access to do anything
        req.flash('error','You dont have the permission to do that');
        return res.redirect('/products');
    }
    next();
}


const isProductAuthor = async(req,res,next)=>{
    let {id}=req.params; // isse product ki id mil jayegi
    let product=await Product.findById(id);// Product ke database m se uss product ko find krenge with the help of id
    
    if (product && product.author && req.user && req.user._id) {
        if (!product.author.equals(req.user._id)) {
            // Your code here 
        req.flash('error','You are not a authorised user');
        return res.redirect(`/products/${id}`); 
    }
}
    next();
}

const validateUser=(req,res,next)=>{  
    const {username,password,email,role}=req.body;
    const {error} =userSchema.validate({username,password,email,role}); // user k schema ko validate kr rhe hai
    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    
    next();

}
module.exports={validateProduct,validateReview,isLoggedIn,isSeller,isProductAuthor,validateUser};
