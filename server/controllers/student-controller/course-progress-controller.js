const CourseProgress = require('../../models/CourseProgress');
const Course = require('../../models/Course');
const StudentCourses = require('../../models/StudentCourses');


//mark current lecture as viewed:

const markCurrentLectureAsViewed = async (req, res) => {
    try {

        const { userId, courseId, lectureId } = req.body;
        let progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress) {
            progress = new CourseProgress({
                userId,
                courseId,
                lecturesProgress: [
                    {
                        lectureId, viewed: true, dateViewed: new Date()
                    }
                ]
            })

            await progress.save()
        }

        else {
            const lectureProgress = progress.lecturesProgress.find(item => item.lectureId === lectureId);

            if (lectureProgress) {
                lectureProgress.viewed = true;
                lectureProgress.dateViewed = new Date
            }
            else {
                progress.lecturesProgress.push({
                    lectureId, viewed: true, dateViewed: new Date()
                })
            }
            await progress.save()
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            })
        }

        //check all lectures viewed or not:
        const allLecturesViewed = progress.lecturesProgress.length ===
            course.curriculum.length && progress.lecturesProgress.every(item => item.viewed)

        if (allLecturesViewed) {
            progress.completed = true;
            progress.completionDate = new Date()

            await progress.save()
        }

        res.status(200).json({
            success: true,
            message: "Lecture viewed",
            data: progress
        })
    }

    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "something went wrong"
        })
    }
}



// get current course progress: 

const getCurrentCourseProgress = async (req, res) => {
    try {

        const { userId, courseId } = req.params;

        const studentPurchasedCourses = await StudentCourses.findOne({
            userId
        })

        const isCurrentCoursePurchasedByCurrentUserOrNot = studentPurchasedCourses?.courses?.findIndex(item => item.courseId === courseId) > -1;

        if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
            return res.status(200).json({
                success: true,
                data: {
                    isPurchased: false,
                },
                message: "you need to purchase this course to access it",
            })
        }

        //first time starting course:
        const currentUserCourseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!currentUserCourseProgress || currentUserCourseProgress.lecturesProgress?.length === 0) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "course not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "No progress found , you can start watching!",
                data: {
                    courseDetails: course,
                    progress: [],
                    isPurchased: true,


                }
            })
        }

        //already course in progress:
        const courseDetails = await Course.findById(courseId);


        res.status(200).json({
            success: true,
            data: {
                courseDetails,
                progress: currentUserCourseProgress.lecturesProgress,
                completed: currentUserCourseProgress.completed,
                completionDate: currentUserCourseProgress.completionDate,
                isPurchased: true
            }
        })




    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "something went wrong"
        })
    }
}



//reset course progress: 
const resetCurrentCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.body

        const progress = await CourseProgress.findOne({ userId, courseId })

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: "progress not found!"
            })
        }

        progress.lecturesProgress = []
        progress.completed = false,
            progress.completionDate = null;

        await progress.save();

        res.status(200).json({
            success: true,
            message: "course Progress has been reseted!",
            data: progress
        })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "something went wrong"
        })
    }
}

module.exports = { getCurrentCourseProgress, markCurrentLectureAsViewed, resetCurrentCourseProgress }