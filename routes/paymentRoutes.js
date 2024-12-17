// const express = require('express');
// const router = express.Router();
// const request = require('request');
// const jsSHA = require('jssha');
// const {v4:uuid} = require('uuid'); // unique id ke liye uuid module ka use krte hai
// const {isLoggedIn} = require('../middleware');

// router.post('/payment_gateway/payumoney', isLoggedIn, (req, res) => {  // y complete code medium pr mil jayega(medium pr available hai to vahan se copy krke paste kr denge)
//     req.body.txnid = uuid();//Here pass txnid and it should be different on every call so unique id ke liye we will use uuid module
//     req.body.email = req.user.email; // req.body object ke email m current user ka email aa jayega
//     req.body.firstname = req.user.username; //Here save all the details in pay object 
    
//     const pay = req.body;

//     const hashString = process.env.MERCHANT_KEY //store in in different file
//                         + '|' + pay.txnid
//                         + '|' + pay.amount 
//                         + '|' + pay.productinfo 
//                         + '|' + pay.firstname 
//                         + '|' + pay.email 
//                         + '|' + '||||||||||'
//                         + process.env.MERCHANT_SALT //store in in different file
   
//     const sha = new jsSHA('SHA-512', "TEXT");
//     sha.update(hashString);
//     //Getting hashed value from sha module
//     const hash = sha.getHash("HEX");
    
//     //We have to additionally pass merchant key to API so remember to include it.
//     pay.key = process.env.MERCHANT_KEY //store in in different file;
//     pay.surl = 'http://localhost:8080/payment/success';  // provide successful url route
//     pay.furl = 'http://localhost:8080/payment/fail';  // provide failure url route
//     pay.hash = hash;
//     //Making an HTTP/HTTPS call with request
//     request.post({
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         url: 'https://sandboxsecure.payu.in/_payment', //Testing url....but jab production m kaam krenge so we will use production url
//         form: pay
//     }, function (error, httpRes, body) {
//         if (error) 
//             res.send(
//                 {status: false, 
//                 message:error.toString()
//                 }
//             );

//         if (httpRes.statusCode === 200) {
//             res.send(body);
//         }

//         else if (httpRes.statusCode >= 300 && httpRes.statusCode <= 400) {
//             res.redirect(httpRes.headers.location.toString());
//         }
//     })
// });

// // success route...payment success url
// router.post('/payment/success',isLoggedIn, async(req, res) => {
//     const { txnid, productinfo, amount } = req.body;

//     // Getting the current User 
//     const user = req.user;


//     // Creating a new order and storing the whole cart into orderedProduct
//     const order = new Order({txnid,productinfo,amount,orderedProducts:[...user.cart]})
    
//     // Pushing the new order into user's order array
//     user.orders.push(order);

//     // saving the new order in database
//     await order.save();

//     // removing everything from current user's cart
//     user.cart.splice(0, user.cart.length);

//     // saving the updated user in the database and assigning updated user to the req.user
//     req.user = await user.save();

//     req.flash('success', 'Placed your order Successfully!!');
//     res.redirect('/user/myorders');
// })

// // failure route..payment failure url
// router.post('/payment/fail',isLoggedIn, (req, res) => {
//     req.flash('error',`Oops! Can't place your order at the moment.Please try again after some time!`)
//     res.redirect('/user/cart');
// })

// module.exports = router;


// // iske baad cart.ejs page pr payment ka form banayenge(copy the form from the medium)



// // payment ke liye we will use payment gateway
// // payment gateway ke liye bahut sari services available hai => payUmoney , paypal , stripe , paytm and rajorpay.....hum koi bhi service use kr sakte hai
// // in our project we will use payUmoney service ...documentation=> payumoney.com
// // we will use the medium => payumoney payment integration
// // payumoney pr account create krne ke baad hume merchant key milegi and merchant salt milega
// // account verification m 2-3 days lag jate hai...verification ke baad hai merchant key and salt milega

// // 1st step..hashsequence create kreneg
// // #Hash Sequence
// // hashSequence =key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
// //  udf stands for user defined field
// // hash sequence m key(merchant key) hoti hai , transaction id hoti hai ,amount hota hai , product ki information hoti hai , firstname hota hai , email hota hai, user defined field hota hai and salt(merchant salt) hota hai

// // 2nd step...hashstring create krte hai
// // hashString = 'YOUR_MERCHANT_KEY' 
// //  + '|' + txnid 
// //  + '|' + amount 
// //  + '|' + productinfo 
// //  + '|' + firstname 
// //  + '|' + email 
// //  + '|' + '||||||||||' 
// //  + 'YOUR_MERCHANT_SALT';
// // hashstring create krte hai isme apni merchant key likhte hai and merchant salt likhte hai

// // 3rd step
// // npm install jssha 
// // const sha = new jsSHA('SHA-512', "TEXT");

// // Then pass hashstring in sha update function.
// // sha.update(hashString);
// // Now store hashed value:
// // const hash = sha.getHash("HEX");

// // 4thstep 
// // we will create post route to make a call to api
// // Payumoney provides testing credentials for implementing and testing purpose.(jab hum development mode m kaam krenge(means learning mode) so we will use this testing url
// // Testing URL:
// // https://sandboxsecure.payu.in/_payment

// // jab production mode m kaam krenge(means production m kaam krenge hamari appliaction m real payments hongi) so we will use this production url
// // Production URL:
// // https://secure.payu.in/_payment
// // apne project ko deploy krne ke baad usme production url ka hi use krenge

// // y sabhi steps medium pr given hai

// // integration details m merchant key and merchant salt milega
// // hum live mode ko test mode m convert kr denge