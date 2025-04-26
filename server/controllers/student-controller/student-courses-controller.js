const StudentCourses = require('../../models/StudentCourses');

const getCoursesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;
        const studentBoughtCourses = await StudentCourses.findOne({
            userId: studentId
        })

        if (!studentBoughtCourses) {
            return res.status(404).json({
                message: " no course found for this student",
                success: false
            })
        }


        res.status(200).json({
            success: true,
            data: studentBoughtCourses.courses,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}

module.exports = { getCoursesByStudentId }