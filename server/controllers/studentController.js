
const Student = require("../models/Student");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.params.userId });
        if (!student) return res.status(404).json({ message: "Profile not found" });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error });
    }
};

const updateStudentProfile = async (req, res) => {
    try {
        const { about, phoneNo, class: studentClass, collegeName, universityName, dob, address, imageBase64 } = req.body;
        let imageUrl;

        if (imageBase64) {
            const uploadResponse = await cloudinary.uploader.upload(imageBase64, { folder: "students" });
            imageUrl = uploadResponse.secure_url;
        }

        const updatedProfile = await Student.findOneAndUpdate(
            { userId: req.params.userId },
            { about, phoneNo, class: studentClass, collegeName, universityName, dob, address, ...(imageUrl && { imageUrl }) },
            { new: true, upsert: true }
        );

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};



const createStudentProfile = async (req, res) => {
    try {
        const { userId, about, phoneNo, class: studentClass, collegeName, universityName, dob, address, imageBase64 } = req.body;


        let imageUrl = "";
        if (imageBase64) {
            const uploadResponse = await cloudinary.uploader.upload(imageBase64, { folder: "students" });
            imageUrl = uploadResponse.secure_url;
        }

        const newProfile = new Student({ userId, about, phoneNo, class: studentClass, collegeName, universityName, dob, address, imageUrl });
        await newProfile.save();

        res.status(201).json(newProfile);
    } catch (error) {
        res.status(500).json({ message: "Error creating profile", error });
    }
};





const getAllStudents = async (req, res) => {
    try {
        const student = await Student.find().sort({ createdAt: -1 });
        if (!student) return res.status(404).json({
            success: false,
            message: "no student found",

        })

        res.status(200).json({
            success: true,
            data: student,
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}




module.exports = { getStudentProfile, updateStudentProfile, createStudentProfile, getAllStudents };
