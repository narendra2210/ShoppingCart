// User.js file m Review.js file ka complete code copy kr lenge

const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose'); // its is a npm package so we will install this package and then require in User model
const userSchema = new mongoose.Schema({ // user ke liye wo schema define krenge jo passpsort-local-mongoose add nhi krega bcz plm 2 field automatically add kr dega username and password  in user database
    email:{
        type:String,
        trim:true,
        required:true
    },
    role:{
        type:String,
        default:'buyer',
    },
    // har user ki ek wishlist array hogi (each user has wishList) 
    wishList:[ // wishlist array ke andar uss product ki id store krnge jise user ne like kiya hsi
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    // cart array banayenge because every user(jisne login kiya hai) uski cart hogi...ek user multiple products ko cart m add kr sakta hai
    cart:[ // cart array m alag alag products ki id store krenge
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Product'// ref m y batate hai objectId(_id) kis model se leni hai...Product ke Model(database) se leni h
        }
        // {
        //     name:  ,
        //     price:  ,
        //     desc:    ,
        //     img:   ,
        //     qty:
        // }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Order'
        }
    ],


    // role means user ka role kya hai buyer hai ya seller hai
   })
userSchema.plugin(passportLocalMongoose);
// if we wanted to use passport-local-mongoose then hume iska plugin lagana padta hai user ke schema pr and  plugin method schema pr apply krte hai
let User=mongoose.model('User',userSchema);

module.exports=User;

// there are two ways to do authentication=> 1.Passport  2.Becrypt
// But hum passport ka use krenge for authentication
// passport....passport-local....passport-local-mongoose (y teeno npm package hai teeno ko install krenge and then require in the file)
// passport and passport-local ko app.js m require krenge and passport-local-mongoose ko user ke model m require krenge
// Passport is a tool or technique which is used for authentication...hashing(to store the password)
// password ko directly store nhi kr sakte so we will use hashing algo to store the password
// jahan pr password store kiya jata hai vahan pr salt bhi store kiya jata hai in the database because salt password ko unique banata hai
// It has only one limitation passport is authentication middleware for Node.js 
// Passportjs.org (documentation)
// jab kisi app ya website pr login krte hai toh vahan pr facebook login,google login , github login bhi hote hai these are called OAuths
// passport strategy ke liye we will use passport-local package
// hashing ke liye we will use passpsort-local-mongoose package so we will install this package and then require in the user model.....hume password ko directly store nhi krna chahiye(otherwise data hack ho jayega) isliye hum password ko directly store nhi krte...password ko pehle hashed krenge and then store krenge....hashing m different algorithms hoti hai jinka use krte hai to store the password
// passport-local-mongoose package automatically 2 field store krke deta hai username and password for hashing...  jab  hum user ka schema define krenge toh usme 2 field nhi daalenge username and password beacuse plm automatically y 2 field Database m store kr dega (add kr dega)
// hash ke sath ek salt bhi hota hai salt new value generate krta hai
// hashing m hum pehle email ya username check krte hai if it matches in the users database then we check whether the input password is correct or not ....if password match nhi krta then it shows your password is incorrect and if input username ya input email login ke time pr match nhi krta then it also shows the password is incorrect  
// hashing ke liye we will use SHA 256
// jab uske output se hum input na bana paye this is knows as hashing algo and it is a one way ...we can also make hashing algorithm

// static methods are those methods jo directly aapke schema ke upar apply ho jate hai....hum static method create bhi kar sakte hai ya kisi third party ki help se use kr sakte hai...there are many static methods (we can see static methods on the documentation passport-local-mongoose npm)
// authenticate means valiadtion krna like zoom meeting limited log hi join kr pate hai beacuse of authenticate if email valid hai then they can join the meeting otherwise they can't
//1. authenticate() method generates a function that is used in Passport's local strategy
// 2.serializeUser() method (iss method ke baare m we can read from the documentation)
// 3.deserializeUser() method 4. register() 5.findByUsername() 6.createStrategy() 
// these all are the static methods