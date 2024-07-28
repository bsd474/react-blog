require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary upload avatar
const cloudinaryUploadAvatar = async (fileUpload) => {
    try {
        const result = await cloudinary.uploader.upload(fileUpload, {
            resource_type: "auto",
        });
        return result;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
}

// Cloudinary remove avatar
const cloudinaryRemoveAvatar = async (imagePublicId) => {
    try {
        const result = await cloudinary.uploader.destroy(imagePublicId);
        return result;
        
    } catch (error) {
        console.error("Error removing from Cloudinary:", error);
        throw error;
    }
}

// export the module
module.exports = { cloudinaryUploadAvatar, cloudinaryRemoveAvatar };