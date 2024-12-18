const express=require('express');
const router=express.Router();//mini instance
const {isLoggedIn}=require('../middleware');
const User=require('../models/User');
const Product=require('../models/Product');
const stripe = require("stripe")(process.env.stripeKey);
const Order = require('../models/Order');





router.get('/user/cart',isLoggedIn,async(req,res)=>{
    try{
        let user=await User.findById(req.user._id).populate('cart'); // jab bhi mongodb ke sath means database ke sath kaam krte hai so we will use populate method.....User ke database m se user ko find krenge with the help of id and user variable m uss user ke cart bhi aa jayenge(means uss user ne apne cart m konse products add kiye hai)
        const totalAmount = user.cart.reduce((sum , curr)=> sum+curr.price , 0); // reduce is a array method(reduce mdn documentation) which accepts two parameters here 0 means initiallty sum is 0
        
        const productInfo = user.cart.map((product)=>product.desc).join(',');
        console.log(productInfo);
        res.render('cart/cart',{user,totalAmount,productInfo});  
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
    
})

router.post('/user/:productId/add',isLoggedIn,async(req,res)=>{
    try{
        let {productId}=req.params;
    let userId =req.user._id;
    let product = await Product.findById(productId);
    let user = await User.findById(userId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart');
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }    
})



router.get("/product/payment", async (req, res) => {
    let user = req.user;
    if (!user) throw new Error("User not authenticated");
    let products = await User.findById({ _id: user._id }).populate("cart");
    if (!products || !products.cart.length)
      throw new Error("No products in cart");
    
    const customer = await stripe.customers.create({
      name: user.username,
      email: user.email,
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
    });
   



    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: Array.from(products.cart).map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${item.name}`,
            },
            unit_amount: item.price * 100,
          },
          quantity: 1,
        };
      }),
      mode: "payment",
      success_url: "https://ecommerce-website-jg4c.vercel.app/success",
      cancel_url: "https://ecommerce-website-jg4c.vercel.app/cancel",
      customer: customer.id, // Link the customer to the session
    });
  
    res.redirect(303, session.url);
  });
  




  router.get("/success", async (req, res) => {
    let currUser = req.user;
    let products = currUser.cart.map((productId) => ({
      product: productId,
      quantity: 1, // Assuming 1 for now, update logic if needed
    }));
    
    let userId = req.user._id;
    let user = await User.findById(userId).populate("cart");
    
    let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
  
    const order = new Order({
      user: currUser._id,
      products,
      totalAmount,
      status: "completed",
    });
    // console.log("Cart Order : ", order);
    await order.save();
    currUser.cart = [];
    await currUser.save();
    
    req.flash("success", "Order Placed Successfully");
    res.redirect("/products");
  });
  



  router.get("/cancel", (req, res) => {
    req.flash("error", "Something Wrong !! Retry");
    res.redirect("/products");
  });



//  to delete the product form the cart
router.delete('/user/:productId',isLoggedIn,async(req,res)=>{
    try{
        let {productId} = req.params;
        let userId = req.user._id;
        let user = await User.findById(userId);
        await User.findByIdAndUpdate(userId,{['$pull']:{cart:productId}}, {new:true});
        res.redirect('/user/cart');
    }
    catch(e)
    {
        res.status(500).render('error',{err:e.message});
    }
})


router.get("/orders", isLoggedIn, async (req, res) => {
    let userId = req.user._id;
    let orders = await Order.find({ user: userId }).populate("products.product");
    res.render("orders/order", { orders });
  });
  
module.exports=router;
