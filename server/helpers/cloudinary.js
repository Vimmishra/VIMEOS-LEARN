const cloudinary = require('cloudinary').v2


//configure with env data:
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


//upload to cloudinary: 

const uploadMediaToCloudinary = async (filePath) => {
    try {

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        })

        return result;
    }
    catch (error) {
        Console.log(error)
        throw new Error('Error uploading to cloudinary')
    }
}



//delete media from cloudnary:

const deleteMediaFromCloudinary = async (publicId) => {
    try {

        await cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        console.log(error);
        throw new Error('error while deleting cloudinary media');
    }
}



module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary }