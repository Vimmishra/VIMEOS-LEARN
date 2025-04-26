import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VideoPlayer from "@/components/video-player"
import { AuthContext } from "@/context/auth-context"
import { StudentContext } from "@/context/student-context"
import { getCurrentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from "@/services"
import axios from "axios"
import { Check, ChevronLeft, ChevronRight, Download, Play } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import Confetti from "react-confetti"
import { useNavigate, useParams } from "react-router-dom"



const StudentViewCourseProgressPage = () => {
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext);

    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useContext(StudentContext);
    const [lockCourse, setLockCourse] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompletedDialog, setShowCourseCompletedDialog] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);


    const { id } = useParams();




    //certificate:
    const [certificateUrl, setCertificateUrl] = useState("");

    const handleDownload = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/certificates/${auth?.user?._id}/${id}`);
            setCertificateUrl(res.data.url);
        } catch (error) {
            console.error("Error downloading certificate:", error);
        }
    };






    async function fetchCurrentCourseProgress() {
        const response = await getCurrentCourseProgressService(auth?.user?._id, id)
        console.log(response);
        if (response.success) {
            console.log(response.data)
            if (!response.data?.isPurchased) {
                setLockCourse(true)
            }
            else {
                setStudentCurrentCourseProgress({
                    courseDetails: response.data.courseDetails,
                    progress: response.data.progress,
                })

                if (response?.data?.completed) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                    setShowCourseCompletedDialog(true);
                    setShowConfetti(true);

                    return;
                }

                if (response.data?.progress.length === 0) {
                    setCurrentLecture(response.data.courseDetails.curriculum[0]);
                }

                else {
                    console.log("logging here.")
                    const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
                        (acc, obj, index) => {
                            return acc === -1 && obj.viewed ? index : acc
                        }, -1
                    )

                    setCurrentLecture(response?.data?.courseDetails?.curriculum[lastIndexOfViewedAsTrue + 1])
                }
            }

        }
    }




    async function updateCourseProgress() {
        if (currentLecture) {
            const response = await markLectureAsViewedService(auth?.user?._id, studentCurrentCourseProgress?.courseDetails?._id, currentLecture?._id)
            if (response?.success) {
                fetchCurrentCourseProgress()
            }
        }
    }



    async function handleRewatchCourse() {
        const response = await resetCourseProgressService(auth?.user?._id, studentCurrentCourseProgress?.courseDetails?._id)

        if (response?.success) {
            setCurrentLecture(null)
            setShowConfetti(false)
            setShowCourseCompletedDialog(false)
            fetchCurrentCourseProgress()
        }
    }



    useEffect(() => {
        fetchCurrentCourseProgress()
    }, [id])


    useEffect(() => {
        if (currentLecture?.progressValue === 1) updateCourseProgress()
    }, [currentLecture])


    useEffect(() => {
        if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
    }, [showConfetti]);



    console.log(studentCurrentCourseProgress, "studentCurrentCourseProgress");
    console.log(currentLecture, "title")

    return (
        <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
            {showConfetti && <Confetti />}
            <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={() => navigate("/student-courses")}
                        className="text-black"
                        variant="ghost"
                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to My Courses Page
                    </Button>
                    <h1 className="text-lg font-bold hidden md:block">
                        {studentCurrentCourseProgress?.courseDetails?.title}
                    </h1>
                </div>
                <Button className="bg-slate-800" onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                    {isSideBarOpen ? (
                        <ChevronRight className="h-6 w-6 " />
                    ) : (
                        <ChevronLeft className="h-6 w-6" />
                    )}
                </Button>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div
                    className={`flex-1 ${isSideBarOpen ? "mr-[400px]" : ""
                        } transition-all duration-300`}
                >
                    <VideoPlayer
                        width="100%"
                        height="500px"
                        url={currentLecture?.videoUrl}
                        title={currentLecture?.title}
                        onProgressUpdate={setCurrentLecture}
                        progressData={currentLecture}

                    />
                    <div className="p-6 bg-[#1c1d1f]">
                        <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
                    </div>
                </div>
                <div
                    className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${isSideBarOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <Tabs defaultValue="content" className="h-full flex flex-col">
                        <TabsList className="bg-[#1c1d1f] grid w-full grid-cols-2 p-0 h-14">
                            <TabsTrigger value="content" className="bg-white text-black rounded-none h-full">
                                course content
                            </TabsTrigger>
                            <TabsTrigger value="overview" className="bg-white text-black rounded-none h-full">
                                Overview
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" >
                            <ScrollArea className="h-full">
                                <div className="p-4 space-y-4">
                                    {
                                        studentCurrentCourseProgress?.courseDetails?.curriculum.map(item =>
                                            <div className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer" key={item._id}>
                                                {
                                                    studentCurrentCourseProgress?.progress?.find(progressItem => progressItem.lectureId === item._id)?.viewed ?
                                                        <Check className="h-4 w-4 text-green" /> : <Play className="h-4 w-4 " />
                                                }
                                                <span>{item?.title}</span>
                                            </div>
                                        )
                                    }
                                </div>

                            </ScrollArea>
                        </TabsContent>


                        <TabsContent value="overview" className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full ">
                                <div className="p-4 ">
                                    <h2 className="text-xl font-bold mb-4 ">About this course</h2>
                                    <p className="text-gray-400">{studentCurrentCourseProgress?.courseDetails?.description}</p>
                                </div>

                                <div className="p-4  ">
                                    <h2 className="text-xl font-bold mb-4 ">About Instructor</h2>
                                    <img src={studentCurrentCourseProgress?.courseDetails?.teacherImage} alt="instructor" className="w-20 h-20 rounded-full" />
                                    <h2 className="text-gray-400">Name: {studentCurrentCourseProgress?.courseDetails?.teacherName}</h2>
                                    <h2 className="text-gray-400">Experience: {studentCurrentCourseProgress?.courseDetails?.teacherExperience}</h2>
                                    <h3 className="text-gray-400 font-semibold "> Message:</h3> <p className="text-gray-300"> {studentCurrentCourseProgress?.courseDetails?.teacherMessage}</p>

                                </div>
                            </ScrollArea>

                        </TabsContent>

                    </Tabs>
                </div>

            </div>




            <Dialog open={lockCourse} >
                <DialogContent className="sm:w-[425px] ">
                    <DialogHeader>
                        <DialogTitle>You cant't view this page!</DialogTitle>
                        <DialogDescription>Please purchase this course to access it!</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>


            <Dialog open={showCourseCompletedDialog}>
                <DialogContent className="sm:w-[425px] ">
                    <DialogHeader>
                        <DialogTitle>Congratulations you have fully completed the course!</DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You have completed the course!</Label>
                            <div className="flex flex-row gap-3">
                                <Button onClick={() => navigate("/student-courses")}>My courses</Button>
                                {!certificateUrl ?
                                    <Button onClick={handleDownload}>View certificate</Button>
                                    : <a className="text-black text-sm font-bold flex gap-4 mt-2 ml-4" href={`${import.meta.env.VITE_SERVER_URL}${certificateUrl}`} download>
                                        Download <Download className="h-4 w-4" />
                                    </a>
                                }





                                <Button onClick={handleRewatchCourse}>Restart Course</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div >

    )
}

export default StudentViewCourseProgressPage


