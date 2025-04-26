const mongoose = require('mongoose');

const AdminImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true }, // Cloudinary public ID for deletion
}, { timestamps: true });

module.exports = mongoose.model('AdminImage', AdminImageSchema);
