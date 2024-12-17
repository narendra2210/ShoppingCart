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
    // reviews array banayenge of objects(because ek product pr multiple reviews ho skte hai means bahut sare users ne ek hi product pr reviews diye hai)...it is a 1 to many relationship
    // array ke andar aisi property apply krenge jisse hum ek review ko dusre review se differentiate kr sake ...property is objectId(_id)
    // 1 to many relationship ke case m complete data store nhi krte...only objectId(_id) store krte hai
    // har element ki unique object id hoti hai(means _id)
    // reviews array m objectId store krenge(review ki object id) 
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

//(iss comment ka proper explanation neeche likha hai code ke andar) middleware jo behind the scences mongodb operations karwane pr use hota hai and iske andar pre and post middleware hote hai which are basically used over the schema and before the model

productSchema.post('findOneAndDelete',async function(product){ // y callback function iss product pr chal rha hai jise parameter m pass kiya hai
    //  findOneAndDelete middleware y callback function run krega jiske parameter m product pass kiya hai and mongodb ka method(findByIdAndDelete() method m id pass ki hai jo iss callback function m as a argument pass hogi)
    if(product.reviews.length>0){
       await Review.deleteMany({_id:{$in:product.reviews}})// reviews ke array m har id ko check krenge and id match hone pr uss review ko delete kr denge from reviews Collection(means reviews ke model m se database se)
    }
    // important=> pre and post middleware ka use schema ke baad and model se pehle krenge
    // As a developer hum production m isi tarah se delete krte hai(schema par middleware apply krte hai)
    // post middleware ka use isliye kr rhe hai beacuse we want jab hum product ko delete kre toh uske reviews bhi delete jo jaye(reviews collection se bhi means database se bhi delete ho jaye) so we'll use the middleware(mongoose ke middleware)=> pre and post
    // pre and post schema ke middleware hai y schema ke upar apply hote hai(documentation=>mongoosejs.com=>click on middleware(vahan pr pre and post middleware honge))
    // pre means pehle(middleware chalne se pehle) and post means baad m (middleware chalne ke baad)
    // .... y check krne ke liye uss product ke reviews reviews ke collection(means reviews ke database) se delete hue hai ya nhi run the command on the mongosh => db.reviews.find({})
    // Model.findByIdAndUpdate is equivalent to Model.findOneAndUpdate...similarly Model.findByIdAndDelete is equivalent to Model.findOneAndDelete
    // jab bhi hum  Model.findByIdAndUpdate , Model.findByIdAndDelete or mongodb ka koi bhi method use krte hai toh uss method ke behind the scene ek middleware chalta hai
    //  if we are using findByIdAndDelete() method then iss method ke behind the scene ek middleware chalega findOneAndDelete.....means mongodb ke method behind the scene middleware ka hi use krte hai
})
let Product=mongoose.model('Product',productSchema);
module.exports=Product;




// middleware(app.use()) is a function which has 3 things (req,res,next) req and res is a object
// next() is method which means move on(aage badhjao)

// app.use('',(req,res,next)=>{
    // console.log("aapka kaam hogya")
    // next();  means move on ho jao(aage badh jao)
//  })