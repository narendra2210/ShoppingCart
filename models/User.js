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
    wishList:[ // wishlist array ke andar uss product ki id store krnge jise user ne like kiya hsi
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    cart:[ // cart array m alag alag products ki id store krenge
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Product'// ref m y batate hai objectId(_id) kis model se leni hai...Product ke Model(database) se leni h
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Order'
        }
    ],


})

userSchema.plugin(passportLocalMongoose);
let User=mongoose.model('User',userSchema);

module.exports=User;
