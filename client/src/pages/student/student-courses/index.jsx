import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Eye } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentCoursesPage = () => {
    const navigate = useNavigate()

    const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(StudentContext);
    const { auth } = useContext(AuthContext)

    async function fetchStudentBoughtCourses() {
        const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
        if (response?.success) {
            setStudentBoughtCoursesList(response?.data);
        }
        console.log(response);
    }
    useEffect(() => {
        fetchStudentBoughtCourses();
    }, []);

    console.log(studentBoughtCoursesList, "list")

    return (
        <div className="p-4 mb-8 mt-20">
            <h1 className="text=3xl font-bold mb-8">My Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {
                    studentBoughtCoursesList && studentBoughtCoursesList.length > 0
                        ? studentBoughtCoursesList.map(course =>
                            <Card key={course.id} className="flex flex-col ">
                                <CardContent className="p-4 flex-grow">
                                    <img
                                        src={course?.courseImage}
                                        alt={course?.title}
                                        className="h-52 w-full object-cover rounded-md mb-4"
                                    />
                                    <h3 className="font-bold mb-1">{course?.title}</h3>
                                    <p className="text-sm text-gray-700 mb-2">CREATED BY : {course?.instructorName?.toUpperCase()}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={() => navigate(`/course-progress/${course?.courseId}`)} className="flex-1">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Start Watching

                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                        : <div className="flex flex-col items-center justify-center">
                            <h1 className="text-3xl font-bold top-16 ">No Courses Bought yet!</h1>
                            <img src="not-foundgif.png" alt="not-found" className="w-[580px] mt-8 md:transform md:translate-x-[200px] lg:mt-0 h-[380px] lg:transform lg:translate-x-[524px] -translate-y-16  " />
                        </div>
                }
            </div>
        </div>
    )
}

export default StudentCoursesPage
