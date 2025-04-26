

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { toast } from "@/hooks/use-toast";
import { checkCoursePurchaseInfoService, createPaymentService, fetchStudentViewCourseDetailService } from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const StudentViewCourseDetailsPage = () => {

    const navigate = useNavigate();

    const { studentViewCourseDetails, setStudentViewCourseDetails,
        currentCourseDetailsId, setCurrentCourseDetailsId,
        loadingState, setLoadingState } = useContext(StudentContext);

    const { auth } = useContext(AuthContext);

    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
    const [showDiscountDialog, setShowDiscountDialog] = useState(false);
    const [approvalUrl, setApprovalUrl] = useState("");

    const [couponCode, setCouponCode] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [checkBoughtCourseInfo, setCheckBoughtCourseInfo] = useState(false);

    const { id } = useParams();
    const location = useLocation();


    //coupon code
    const applyCoupon = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/coupons/apply-coupon/${studentViewCourseDetails?._id}/${couponCode}`);

            const data = await response.json();
            if (data.success) {
                setDiscountedPrice(data.discountedPrice);

                toast({
                    title: "Coupon applied!",
                    description: "Coupon applied successfully! ",
                    position: "top-right"
                })

            } else {

                toast({
                    title: "Invalid coupon code!!",
                    description: "You've entered an invalid coupon code.",
                    variant: "destructive",
                    position: "top-right"
                })


                alert(data.message);
            }

            console.log(response, "resp")
        } catch (error) {
            console.error("Error applying coupon:", error);
        }
    };



    async function fetchStudentViewCourseDetails() {

        const checkCoursePurchaseInfoResponse = await checkCoursePurchaseInfoService(currentCourseDetailsId, auth?.user?._id)
        if (checkCoursePurchaseInfoResponse?.success && checkCoursePurchaseInfoResponse.data) {
            navigate(`/course-progress/${currentCourseDetailsId}`)
            return
        }


        //else:
        const response = await fetchStudentViewCourseDetailService(currentCourseDetailsId)

        if (response.success) {
            setStudentViewCourseDetails(response?.data);

            setLoadingState(false)
        } else {
            setStudentViewCourseDetails(null)

            setLoadingState(false)
        }
    }


    function handleSetFreePreview(getCurrentVideoInfo) {
        setDisplayCurrentVideoFreePreview(getCurrentVideoInfo.videoUrl)

    }


    async function handleCreatePayment() {
        const paymentPayload = {
            userId: auth?.user?._id,
            userName: auth?.user.userName,
            userEmail: auth?.user?.userEmail,
            orderStatus: 'pending',
            paymentMethod: 'paypal',
            paymentStatus: 'initiated',
            orderDate: new Date,
            paymentId: '',
            payerId: '',
            instructorId: studentViewCourseDetails?.instructorId,
            instructorName: studentViewCourseDetails?.instructorName,
            courseImage: studentViewCourseDetails?.image,
            courseTitle: studentViewCourseDetails?.title,
            courseId: studentViewCourseDetails?._id,
            coursePricing: discountedPrice ? discountedPrice : studentViewCourseDetails?.pricing,
        }
        console.log(paymentPayload, "payment");
        const response = await createPaymentService(paymentPayload);
        if (response.success) {
            sessionStorage.setItem('currentOrderId', JSON.stringify(response?.data?.orderId))
            setApprovalUrl(response?.data?.approvalUrl)
        }
    }

    useEffect(() => {
        if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true)
    }, [displayCurrentVideoFreePreview])



    useEffect(() => {
        if (currentCourseDetailsId !== null)
            fetchStudentViewCourseDetails()

    }, [currentCourseDetailsId])


    useEffect(() => {
        if (id)
            setCurrentCourseDetailsId(id)

    }, [id])


    useEffect(() => {
        if (!location.pathname.includes('/course/details')) {
            setStudentViewCourseDetails(null), setCurrentCourseDetailsId(null)
        }
    }, [location.pathname])

    if (loadingState) return <Skeleton />

    if (approvalUrl !== "") {
        window.location.href = approvalUrl
    }


    const getIndexOfFreePreviewUrl = studentViewCourseDetails !== null ?
        studentViewCourseDetails?.curriculum.findIndex(item => item.freePreview)
        : -1


    return (
        <div className=" mx-auto p-4 mt-16 mb-12">
            <div className="bg-gray-900 text-white p-8 rounded-t-lg ">
                <h1 className="text-3xl font-bold mb-4">{studentViewCourseDetails?.title}</h1>
                <p className="mb-4 text-xl">{studentViewCourseDetails?.subtitle}</p>
                <div className="flex flex-wrap items-center space-x-4 mt-2 text-sm">
                    <span>Created By {studentViewCourseDetails?.instructorName}</span>
                    <span> Created On {studentViewCourseDetails?.date.split('T')[0]}</span>
                    <div className="flex flex-col sm:flex-row items-center space-x-4">

                        <span className="flex items-center">
                            <Globe className="h-4 w-4 mr-1" />
                            {studentViewCourseDetails?.primaryLanguage}
                        </span>
                        <span>{studentViewCourseDetails?.students.length}
                            {studentViewCourseDetails?.students.length <= 1 ? ' Student' : ' Students'}</span>


                        <span>Course duration: {studentViewCourseDetails?.courseDuration}</span>
                    </div>
                </div>


            </div>



            <div className="flex flex-col md:flex-row gap-8 mt-8 ">
                <main className="flex-grow">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>What you'll learn</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {studentViewCourseDetails?.objectives.split(",").map((objective, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span>{objective}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>


                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Description</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {studentViewCourseDetails?.description}
                        </CardContent>
                    </Card>


                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Curriculum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
                                <li
                                    className={`${curriculumItem?.freePreview ? "cursor-pointer"
                                        : "cursor-not-allowed"
                                        } flex items-center mb-4`}

                                    onClick={curriculumItem?.freePreview ? () => handleSetFreePreview(curriculumItem) : null}
                                >
                                    {curriculumItem?.freePreview ? (
                                        <PlayCircle className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Lock className="mr-2 h-4 w-4" />
                                    )}
                                    <span>{curriculumItem?.title}</span>
                                </li>
                            )
                            )}
                        </CardContent>
                    </Card>




                    <Card className="mb-8 ">
                        <CardHeader>
                            <CardTitle>Instructor Details</CardTitle>
                        </CardHeader>

                        <CardContent className=" space-y-4">
                            <img className=" ml-2 top-0  h-[85px] w-[87px] rounded-full object-cover"
                                src={studentViewCourseDetails?.teacherImage}
                            />
                            <h1 className='font-semibold'>Instructor Name: {studentViewCourseDetails?.teacherName}</h1>
                            <h1 className=" font-semibold">Experience: {studentViewCourseDetails?.teacherExperience}</h1>
                            <div className="space-y-0">
                                <h1 className="text-[20px] font-semibold">Message:</h1> <p>{studentViewCourseDetails?.teacherMessage}</p>
                            </div>

                        </CardContent>
                    </Card>




                </main>


                <aside className="w-full md:w-[500px]">
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <div className="aspect-video mb-4  rounded-lg flex item-center justify-center">
                                <VideoPlayer
                                    url={getIndexOfFreePreviewUrl !== -1 ?
                                        studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl :
                                        ""
                                    }
                                    width="450px"
                                    height="200px"
                                />

                            </div>
                            <div className="mb-4 ">
                                <span className="text-3xl font-bold">${studentViewCourseDetails?.pricing}</span>
                            </div>

                            <Button onClick={() => setShowDiscountDialog(true)} className="w-full ">
                                Buy Now
                            </Button>
                        </CardContent>
                    </Card>

                </aside>
            </div>



            <Dialog open={showFreePreviewDialog} onOpenChange={() => {
                setShowFreePreviewDialog(false)
                setDisplayCurrentVideoFreePreview(null)
            }} >
                <DialogContent className="w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Course Preview</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-lg flex item-center justify-center">
                        <VideoPlayer
                            url={displayCurrentVideoFreePreview}
                            width="450px"
                            height="200px"
                        />

                    </div>

                    <div className="flex flex-col gap-2">
                        {
                            studentViewCourseDetails?.curriculum?.filter(item => item.freePreview).map(filteredItem =>

                                <div className="flex flex-cols-2">
                                    <PlayCircle className="mr-2 mt-1 h-4 w-4" />
                                    <p onClick={() => handleSetFreePreview(filteredItem)} className="cursor-pointer text-[16px] font-medium">{filteredItem.title}</p>
                                </div>
                            )
                        }
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>







            <Dialog open={showDiscountDialog} onOpenChange={() => {
                setShowDiscountDialog(false)

            }} >
                <DialogContent className="w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Payment Preview</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-lg flex item-center justify-center">

                        <img
                            src={studentViewCourseDetails?.image}
                            alt="courseImage"
                        />


                    </div>
                    <div className=" flex gap-2 ">
                        <Input
                            className="rounded-md w-80 "
                            type="text"
                            placeholder="Enter Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button className=" w-1/3 cursor-pointer " onClick={applyCoupon}>Apply Coupon</Button>
                    </div>
                    {discountedPrice ? discountedPrice && <p className="font-bold mt-2 text-lg">Discounted Price: ${discountedPrice}</p> :
                        <p className="font-bold mt-2 text-xl"> Total Price: ${studentViewCourseDetails?.pricing}</p>}



                    <Button className=" cursor-pointer bg-green-500" variant="ghost" onClick={() => handleCreatePayment()}>PAY</Button>


                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    )
}

export default StudentViewCourseDetailsPage





