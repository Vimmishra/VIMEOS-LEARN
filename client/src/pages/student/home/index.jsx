/*

import Chatbot from "@/components/student-view/chatBot"
import { Button } from "@/components/ui/button"
import { courseCategories } from "@/config"
import { AuthContext } from "@/context/auth-context"
import { StudentContext } from "@/context/student-context"
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/services"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Typewriter } from "react-simple-typewriter"

const StudentHomePage = () => {

    const topics = ["MERN", "React", "NEXTJS", "MEAN", "Vue", "Angular", "Python", "JAVA", "JavaScript", "C++"];

    const [currentTopic, setCurrentTopic] = useState(topics[0]);

    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTopic((prev) => {
                const nextIndex = (topics.indexOf(prev) + 1) % topics.length;

                return topics[nextIndex];
            });
        }, 2000);

        return () =>
            clearInterval(interval);

    }, [])


    useEffect(() => {
        fetchImage();
    }, []);


    const fetchImage = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/image`);
            if (data.image) {
                setUploadedImageUrl(data.image.url);
            }
            console.log(data.image)
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };


    const navigate = useNavigate();
    const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext)
    const { auth } = useContext(AuthContext);

    async function fetchAllStudentViewCourses() {
        const response = await fetchStudentViewCourseListService();
        if (response.success) {
            setStudentViewCoursesList(response?.data)
        }


    }


    async function handleCourseNavigate(getCurrentCourseId) {
        const response = await checkCoursePurchaseInfoService(
            getCurrentCourseId,
            auth?.user?._id
        );


        if (response?.success) {
            if (response?.data) {
                navigate(`/course-progress/${getCurrentCourseId}`);
            } else {
                navigate(`/course/details/${getCurrentCourseId}`);
            }
        }
    }



    function handleNavigateToCoursesPage(getCurrentId) {
        console.log(getCurrentId)
        sessionStorage.removeItem('filters');
        const currentFilter = {
            category: [getCurrentId]
        }

        sessionStorage.setItem('filters', JSON.stringify(currentFilter))
        navigate('/courses')
    }



    useEffect(() => {
        fetchAllStudentViewCourses()
    }, [])

    return (


        <div className="min-h-screen bg-white ">

            <section className="flex flex-col lg:flex-row items-center 
            justify-between py-8 px-4 lg:px-8">
                <div className="lg:w-1/2 lg:pr-12">

                    <h1 className="text-4xl font-bold mb-4">Learning  <span className="font-bold text-blue-600">
                        <Typewriter
                            words={["MERN", "Data Science", "Angular", "Python", "Java", "C++", "NextJS", "MEAN", "NodeJs"]}
                            loop={true}
                            cursor
                            cursorStyle="|"
                            typeSpeed={70}
                            deleteSpeed={60}
                            delaySpeed={1000}
                        />
                    </span> </h1>



                    <p className="text-xl">
                        Skills that make you a step ahead of your present. We offer courses that are made for students like you, with us you will become a{" "}
                        <span className="font-bold text-blue-600">
                            <Typewriter
                                words={[" Developer.", "Data Scientist.", " UI/UX Designer.", "AI Engineer.", "App Developer"]}
                                loop={true}
                                cursor
                                cursorStyle="|"
                                typeSpeed={70}
                                deleteSpeed={50}
                                delaySpeed={1000}
                            />
                        </span>
                    </p>



                </div>
                <div className="lg:w-full mb-8 lg:mb-0">
                    <img src={uploadedImageUrl}
                        width={600}
                        height={400}
                        className="w-full h-auto lg:h-[470px] rounded-lg shadow-lg"
                    />
                </div>
            </section>
            <section className="py-8 px-4 lg:px-8 bg-gray-100">
                <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {
                        courseCategories.map(categoryItem =>



                            <Button variant="outline" key={categoryItem.id} className="justify-start"
                                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
                            >
                                {categoryItem.label}</Button>
                        )
                    }
                </div>

            </section>
            <section className="py-12 px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        studentViewCoursesList && studentViewCoursesList.length > 0 ?
                            studentViewCoursesList.map(courseItem =>


                                <div onClick={() => handleCourseNavigate(courseItem?._id)} className="border rounded-lg overflow-hidden shadow cursor-pointer">
                                    <img src={courseItem?.image}
                                        width={300}
                                        height={150}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4 ">
                                        <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{courseItem?.courseDuration}</p>
                                        <p className="font-bold text-[16px]">${courseItem?.pricing}</p>
                                    </div>
                                </div>
                            ) : <h1>No Courses Listed yet!</h1>
                    }

                </div>
            </section>

            <Chatbot />




        </div>


    )
}

export default StudentHomePage

*/




import FadeInOnScroll from "@/components/animatedPageWrapper";
import Chatbot from "@/components/student-view/chatBot";
import { Button } from "@/components/ui/button";
import { courseCategories } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
    checkCoursePurchaseInfoService,
    fetchStudentViewCourseListService,
} from "@/services";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

const StudentHomePage = () => {
    const topics = [
        "MERN",
        "React",
        "NEXTJS",
        "MEAN",
        "Vue",
        "Angular",
        "Python",
        "JAVA",
        "JavaScript",
        "C++",
    ];

    const [currentTopic, setCurrentTopic] = useState(topics[0]);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTopic((prev) => {
                const nextIndex = (topics.indexOf(prev) + 1) % topics.length;
                return topics[nextIndex];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchImage();
    }, []);

    const fetchImage = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/admin/image`
            );
            if (data.image) {
                setUploadedImageUrl(data.image.url);
            }
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    };

    const navigate = useNavigate();
    const { studentViewCoursesList, setStudentViewCoursesList } =
        useContext(StudentContext);
    const { auth } = useContext(AuthContext);

    async function fetchAllStudentViewCourses() {
        const response = await fetchStudentViewCourseListService();
        if (response.success) {
            setStudentViewCoursesList(response?.data);
        }
    }

    async function handleCourseNavigate(getCurrentCourseId) {
        const response = await checkCoursePurchaseInfoService(
            getCurrentCourseId,
            auth?.user?._id
        );
        if (response?.success) {
            if (response?.data) {
                navigate(`/course-progress/${getCurrentCourseId}`);
            } else {
                navigate(`/course/details/${getCurrentCourseId}`);
            }
        }
    }

    function handleNavigateToCoursesPage(getCurrentId) {
        sessionStorage.removeItem("filters");
        const currentFilter = {
            category: [getCurrentId],
        };
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        navigate("/courses");
    }

    useEffect(() => {
        fetchAllStudentViewCourses();
    }, []);

    return (
        <div className="min-h-screen bg-white mt-20">
            <FadeInOnScroll>
                <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
                    <div className="lg:w-1/2 lg:pr-12">
                        <h1 className="text-4xl font-bold mb-4">
                            Learning {" "}
                            <span className="font-bold text-blue-600">
                                <Typewriter
                                    words={[
                                        "MERN",
                                        "Data Science",
                                        "Angular",
                                        "Python",
                                        "Java",
                                        "C++",
                                        "NextJS",
                                        "MEAN",
                                        "NodeJs",
                                    ]}
                                    loop={true}
                                    cursor
                                    cursorStyle="|"
                                    typeSpeed={70}
                                    deleteSpeed={60}
                                    delaySpeed={1000}
                                />
                            </span>{" "}
                        </h1>
                        <p className="text-xl">
                            Skills that make you a step ahead of your present. We offer courses
                            that are made for students like you, with us you will become a {" "}
                            <span className="font-bold text-blue-600">
                                <Typewriter
                                    words={[
                                        " Developer.",
                                        "Data Scientist.",
                                        " UI/UX Designer.",
                                        "AI Engineer.",
                                        "App Developer",
                                    ]}
                                    loop={true}
                                    cursor
                                    cursorStyle="|"
                                    typeSpeed={70}
                                    deleteSpeed={50}
                                    delaySpeed={1000}
                                />
                            </span>
                        </p>
                    </div>
                    <div className="lg:w-full mb-8 lg:mb-0">
                        <img
                            src={uploadedImageUrl}
                            width={600}
                            height={400}
                            className="w-full h-auto lg:h-[470px] rounded-lg shadow-lg"
                        />
                    </div>
                </section>
            </FadeInOnScroll>

            <FadeInOnScroll>
                <section className="py-8 px-4 lg:px-8 bg-gray-100">
                    <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {courseCategories.map((categoryItem) => (
                            <Button
                                variant="outline"
                                key={categoryItem.id}
                                className="justify-start"
                                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
                            >
                                {categoryItem.label}
                            </Button>
                        ))}
                    </div>
                </section>
            </FadeInOnScroll>

            <FadeInOnScroll>
                <section className="py-12 px-4 lg:px-8">
                    <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                            studentViewCoursesList.map((courseItem) => (
                                <FadeInOnScroll key={courseItem?._id}>
                                    <div
                                        onClick={() => handleCourseNavigate(courseItem?._id)}
                                        className="border rounded-lg overflow-hidden shadow cursor-pointer"
                                    >
                                        <img
                                            src={courseItem?.image}
                                            width={300}
                                            height={150}
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {courseItem?.courseDuration}
                                            </p>
                                            <p className="font-bold text-[16px]">
                                                ${courseItem?.pricing}
                                            </p>
                                        </div>
                                    </div>
                                </FadeInOnScroll>
                            ))
                        ) : (
                            <h1>No Courses Listed yet!</h1>
                        )}
                    </div>
                </section>
            </FadeInOnScroll>

            <Chatbot />
        </div>
    );
};

export default StudentHomePage;