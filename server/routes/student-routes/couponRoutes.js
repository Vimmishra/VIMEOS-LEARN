const express = require("express");
const Course = require("../../models/Course");

const router = express.Router();

router.get("/apply-coupon/:courseId/:couponCode", async (req, res) => {
    try {

        const { courseId, couponCode } = req.params;


        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });



        if (course.coupon && course.coupon == couponCode) {
            const discountedPrice = course.pricing * 0.8; // 20% discount
            return res.json({ success: true, discountedPrice });
        } else {
            return res.status(400).json({ success: false, message: "Invalid coupon code" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
