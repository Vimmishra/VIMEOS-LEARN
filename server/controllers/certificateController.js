const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");

exports.generateCertificate = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        // Check if the student has completed the course
        const progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress || progress.progress < 100) {
            return res.status(400).json({ message: "Course not completed" });
        }

        // Fetch student and course details
        const student = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!student || !course) {
            return res.status(404).json({ message: "User or Course not found" });
        }

        // Create a PDF document
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, `../certificates/${userId}_${courseId}.pdf`);
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Design the certificate
        doc.fontSize(24).text("Certificate of Completion from VIMEOS LEARN", { align: "center" });
        doc.moveDown();
        doc.fontSize(18).text(`This is to certify that ${student.userName}`, { align: "center" });
        doc.fontSize(16).text(`has successfully completed the course "${course.title}".`, { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });

        doc.end();

        stream.on("finish", () => {
            res.json({ message: "Certificate generated", url: `/certificates/${userId}_${courseId}.pdf` });
        });
    } catch (error) {
        console.error("Error generating certificate:", error);
        res.status(500).json({ message: "Error generating certificate" });
    }
};
