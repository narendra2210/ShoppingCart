const mongoose=require('mongoose');
const Review = require('./Review');
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    } ,
    image:{
        secure_url:{
            type:String,
            trim:true
        },
        public_id:{
            type:String,
            required:true
        }
       
    } ,
    price: {
        type:Number,
        min:0,
        required:true
    },
    desc: {
        type:String,
        trim:true
    },
    avgRating:{
        type : Number,
        default:0
    },
    
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'// ref m y batate hai objectId(_id) kis model se leni hai...Review ke Model se leni h
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'// ref m y batate hai objectId(_id) kis model se leni hai...User ke Model(database) se leni h
    }
})

productSchema.post('findOneAndDelete',async function(product){ // y callback function iss product pr chal rha hai jise parameter m pass kiya hai
    if(product.reviews.length>0){
       await Review.deleteMany({_id:{$in:product.reviews}})// reviews ke array m har id ko check krenge and id match hone pr uss review ko delete kr denge from reviews Collection(means reviews ke model m se database se)
    }
})


let Product=mongoose.model('Product',productSchema);
module.exports=Product;

