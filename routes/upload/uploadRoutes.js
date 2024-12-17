// const express = require('express');
// const router = express.Router();
// const cloudinary = require("../../cloudinaryConfig");
// const upload = require("../../multer");
// const uploadImageOnCloudinary = require('../../cloudinaryConfig');


// router.post('/products', upload.single('image'), async (req, res) => {
//   try {
//     console.log("File received:", req.file);
//       const uploadResult = await uploadImageOnCloudinary(req.file.path, 'products');
//       console.log("Cloudinary upload result:", uploadResult);
//       const file = {
//           image: uploadResult.secure_url
//       };
//       // Assuming you are saving the file details in a database
//       // await file.save();

//       return res.status(200).json({ msg: 'File has been uploaded successfully', file });
//   } catch (error) {
//       console.error(error);
//       return res.status(400).json({ msg: 'Something went wrong', error: error.message });
//   }
// });

// module.exports = router;

// // jab bhi image ya file uplaod krni hai toh postman m body ke andar form data ko select krte hai






