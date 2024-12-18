const mongoose= require('mongoose');
const Product=require('./models/Product');

const products=[
     {
        name:"Iphone 14pro",
        img:"https://images.unsplash.com/photo-1535432427690-545ed8124869?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8",
        price: 130000,
        desc: "very costly"
     },
     {
        name:"macbook m2 pro",
        img:"https://images.unsplash.com/photo-1569770218135-bea267ed7e84?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFjYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D",
        price: 250000,
        desc: "very bad"
     },
     {
        name:"Iwatch",
        img:"https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SXdhdGNofGVufDB8fDB8fHww",
        price: 51000,
        desc: "It's very cheap"
     },
     {
        name:"iPad pro",
        img:"https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBhZCUyMHByb3xlbnwwfHwwfHx8MA%3D%3D",
        price: 237900,
        desc: "It is not working properly"
     },
     {
        name:"Airpods",
        img:"https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWlycG9kc3xlbnwwfHwwfHx8MA%3D%3D",
        price: 25000,
        desc: "Very good"
     }
]
async function seedDB(){
   await Product.insertMany(products);
   console.log("Data seeded successfully");
}
module.exports=seedDB;