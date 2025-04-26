const AdminImage = require('../models/Home');
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require('../helpers/cloudinary');
const fs = require('fs');

exports.uploadAdminImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const cloudinaryResponse = await uploadMediaToCloudinary(req.file.path);

        // Delete the file from local storage after upload
        fs.unlinkSync(req.file.path);

        // Save in MongoDB
        const newImage = new AdminImage({
            url: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
        });
        await newImage.save();

        res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading image' });
    }
};

exports.getAdminImage = async (req, res) => {
    try {
        const image = await AdminImage.findOne().sort({ createdAt: -1 }); // Get the latest image
        if (!image) {
            return res.status(404).json({ message: 'No image found' });
        }
        res.status(200).json({ image });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching image' });
    }
};

exports.updateAdminImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const existingImage = await AdminImage.findOne().sort({ createdAt: -1 });
        if (existingImage) {
            await deleteMediaFromCloudinary(existingImage.publicId);
            await AdminImage.findByIdAndDelete(existingImage._id);
        }

        const cloudinaryResponse = await uploadMediaToCloudinary(req.file.path);
        fs.unlinkSync(req.file.path);

        const updatedImage = new AdminImage({
            url: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
        });

        await updatedImage.save();

        res.status(200).json({ message: 'Image updated successfully', image: updatedImage });
    } catch (error) {
        res.status(500).json({ error: 'Error updating image' });
    }
};
