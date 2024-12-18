const express = require('express');
const router = express.Router();
let {isLoggedIn} = require('../../middleware');
const User = require('../../models/User');

router.post('/product/:productid/like' , isLoggedIn , async(req,res)=>{ // product ko like krne ke liye user login hona chahihye toh jab user like button pr click krega toh sabse pehle isLoggedIn middleware chalega
    let {productid} = req.params; // params object se product ki id mil jayegi
    console.log(productid)
    let user = req.user; // grab the current loggedin user
    let isLiked = user.wishList.includes(productid);  // we will check product pehle se liked hai ya nhi(means user ki wishlist array m iss product ki id hai ya nhi...if id hai toh product ko unlike kr denge means uss productis ko wishlist array m se remove kr dengen and if productid nhi hai toh product ko like kr denge means wishlist array m uss productid ko add kr denge)...if pehle se liked hai so it will return true and liked button pr click krenge toh unlike ho jayega .if pehle se liked nhi hai so it will return false aur like button pr click krenge toh like ho jayega
    const option = isLiked? '$pull' : '$addToSet';  // pull and add to set both are mongodb operator  (array operator)
    req.user = await User.findByIdAndUpdate(req.user._id , {[option]:{wishList:productid}} , {new:true} ) // user ko update krenge means user ki wishlist array ko update krenge
    res.send('like api');
})

module.exports = router;  