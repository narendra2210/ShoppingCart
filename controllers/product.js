const express=require('express');
const {uploadImageOnCloudinary,deleteImageFromCloudinary} = require('../cloudinaryConfig');
const Product=require('../models/Product');


const showAllProducts=async(req,res)=>{// jab user /products pr req send krega toh sabse pehle isLoggedIn middleware chalega in middleware.js file and iss middleware m check krenge if user login hai means loggedin hai toh it will return true
    try{
        
        let products=await Product.find({});
    
        res.render('products/index',{products});
    
    }
    catch(e){
       
        res.status(500).render('error',{err:e.message});
    }  
}


const productForm=(req,res)=>{
    try{
         res.render('products/new');
    // // response m new form show hoga
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    //     // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge   
     }
}


const createProduct = async (req,res)=>{ //  jab y route hit hoga /products toh validateProduct middleware chalega in middleware.js file and if product validate hone ke baad error nhi aaya toh uss file m next() chalega means iss route m jo callback fun hai validateProduct middleware ke baad wo run hoga
    try{
        console.log("create")

        console.log("File received:", req.file);
         // Check if file was uploaded successfully
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        // Upload image to Cloudinary
        const uploadResult = await uploadImageOnCloudinary(req.file.path, 'products');
   
        const { secure_url, public_id } = uploadResult;
            // jab form submit hoga toh sara data req ki body m milega ....toh unn sabhi data ko object ke andar destructure krenge....(object ke andar vahi name likhte h jo humne schema m define kiya h)
            const {name,price,desc}=req.body;  // body object ke data ko dekhne ke liye we will use the middleware app.use(express.urlencoded)
          
            // database ke andar new product ko add krenge...means Product model ke andar new product create krenge and req.user object ke andar currentuser ki sari information hoti hai jo abhi login hua hai toh req.user._id se currentuser ki id(objectid) author m assign kr denge means jo user abhi loggedin hua hai uski id author m assign kr denge...toh jab hum ek new product banayenge toh usme author ki id bhi store hogi
           const newProduct =  await Product.create({
            name,price,desc,author:req.user._id,
                image:{
                    secure_url,
                    public_id
                }
                }); // create method ko call krne ke

                if (!newProduct) {
                    console.error('Error while creating product in the database');
                    return res.status(400).json({ msg: 'Error while creating product in the database' });
                }

                console.log('Product added successfully:', newProduct);
              
                req.flash('success','Product added successfully');
            console.log("redirect to products page")
            res.redirect('/products')// redirect means get req jayegi /products pr and sabhi products show ho jayenge with new product
    }
    catch(e){
        // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
        console.error(error);
    return res.status(500).json({ msg: 'Something went wrong', error: error.message });
}

}

const showProduct = async(req,res)=>{
    try{
        // id params object se milegi toh id ko object ke andar destructure krenge
    let {id} =req.params; // isse id mil jayegi
    // product model ke andar se product find krenge with the help of id
    let foundProduct= await Product.findById(id).populate('reviews'); //   product find krne ke baad use populate krenge(show krenge) reviews array ke sath means product ko show krenge reviews ke sath
    res.render('products/show',{foundProduct,msg:req.flash('msg')});// res m show page show hoga and uss show page wo product(foundProduct) bhej rhe hai

    }
    catch(e){
        // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
        res.status(500).render('error',{err:e.message});
    }

}


const editProductForm = async(req,res)=>{ // isLoggedIn is a middleware iska use isliye kr rhe hai if user login hai tabhi products dekh sakta hai otherwsie nhi(isLoggedIn widdleware middleware.js file m banaya hai from the documentation of passport)
    try{
        let {id}=req.params;
        let foundProduct= await Product.findById(id);
        console.log(foundProduct);
        //  res.status(200).json({foundProduct});
        res.render('products/edit',{foundProduct});
    }
    catch(e){
        // e object m error hota hai toh err ko catch krenge and e object m message field bhi hota hai toh error ke message ko bhi bhejenge
        res.status(500).render('error',{err:e.message});
    }
   
}


const updateProduct = async (req, res) => {
    try {
        console.log("updateProduct");
        const { id } = req.params;
        const { name, price, desc } = req.body;
        console.log(req.body);

        // Find the existing product
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check if a new file is uploaded
        if (req.file) {
            // Delete the old image from Cloudinary
            if (product.image.public_id) {
                await deleteImageFromCloudinary(product.image.public_id);
            }

            // Upload new image to Cloudinary
            const uploadResult = await uploadImageOnCloudinary(req.file.path, 'products');
            product.image.secure_url = uploadResult.secure_url;
            product.image.public_id = uploadResult.public_id;
        } else {
            // If no new image is uploaded, retain the existing image details
            product.image.secure_url = product.image.secure_url;
            product.image.public_id = product.image.public_id;
        }

        // Update product details
        product.name = name;
        product.price = price;
        product.desc = desc;

        // Save the updated product
        const updatedProduct = await product.save();
        if (!updatedProduct) {
            return res.status(400).json({ msg: 'Error while updating product in the database' });
        }

        req.flash('success', 'Product edited successfully');
        res.redirect(`/products/${id}`); // Redirect to the edited product page
    } catch (e) {
        console.error(e);
    }
}




const deleteProduct = async(req,res)=>{
    try{
        let {id} =req.params;
        const product = await Product.findById(id);
        await Product.findByIdAndDelete(id);// findByIdAndDelete jab mongodb ka y method run hoga toh iss method ke behind the scene ek middleware chalega(means mongodb ka y method behind the scene middleware chala rha hai) jo Product ke schema pr apply kiya hai in Product.js file(because product ka schema model ke andar hota hai)
        req.flash('success','Product deleted successfully');
        res.redirect('/products');
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
}


module.exports = {showAllProducts , productForm , createProduct , showProduct , editProductForm , updateProduct , deleteProduct }
