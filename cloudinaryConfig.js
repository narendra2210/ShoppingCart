
const cloudinary = require('cloudinary').v2;
// const { log } = require('console');
const fs = require('fs');
// require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadImageOnCloudinary = async(filePath,folderName) =>{
  try{
    // uploading image on cloudinary from server
    const result = await cloudinary.uploader.upload(filePath,{
      folder:folderName
    });

    // delete image from server
    try{
      console.log("delete image from localserver")
      fs.unlinkSync(filePath);

    }
    catch(err){
      console.log("failed to delete image from the server",err);
    }
    
    console.log(result); // cloudinary pr image uplaod krne ke baad jo cheeze milti hai wo result m aa jayengi
    return {
      secure_url:result.secure_url,
      public_id:result.public_id

    };

  }
  catch (error) {
    console.log("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }

  finally{
    console.log("Image uploaded to Cloudinary successfully");
  }
}

const deleteImageFromCloudinary = async (publicId) => {
  try {
      await cloudinary.uploader.destroy(publicId);
      console.log('Image deleted from Cloudinary');
  } 
  catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new Error('Failed to delete image from Cloudinary');
  }
};
module.exports = {uploadImageOnCloudinary,deleteImageFromCloudinary};
