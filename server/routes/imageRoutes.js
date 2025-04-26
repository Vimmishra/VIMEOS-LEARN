const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadAdminImage, getAdminImage, updateAdminImage } = require('../controllers/homeController');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('image'), uploadAdminImage);
router.get('/image', getAdminImage);
router.put('/update', upload.single('image'), updateAdminImage);

module.exports = router;
