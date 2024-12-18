const express=require('express');
const Product=require('../models/Product');

const {validateProduct,isLoggedIn,isSeller,isProductAuthor,validateUser}=require('../middleware');
const {showAllProducts, productForm , createProduct , showProduct , editProductForm , updateProduct , deleteProduct} =  require('../controllers/product')
const router = express.Router()// mini instance
const upload = require('../multer');

router.get('/products', showAllProducts);

router.get('/product/new', isLoggedIn, isSeller, productForm);

router.post('/products', isLoggedIn,upload.single('image'), isSeller, validateProduct, createProduct);

router.get('/products/:id', isLoggedIn, showProduct);

router.get('/products/:id/edit',isLoggedIn,isProductAuthor, editProductForm);

router.patch('/products/:id', isLoggedIn,upload.single('image'), isProductAuthor, validateProduct, updateProduct);

router.delete('/products/:id',isLoggedIn,isProductAuthor,deleteProduct);



module.exports = router;
