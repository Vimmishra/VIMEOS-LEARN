


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import { getSearchResults } from "@/store/course/search-slice";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";


function SearchPage() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { searchResults } = useSelector(state => state.CourseSearch);
    const [profileData, setProfileData] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { auth } = useContext(AuthContext);

    const [acceptedRequests, setAcceptedRequests] = useState(new Set());
    const [studentsWhoAddedMe, setStudentsWhoAddedMe] = useState(new Set());
    const [sentRequests, setSentRequests] = useState(new Set());
    const [boughtCoursesInfo, setBoughtCoursesInfo] = useState({});

    // 🔥 Fetch my connections
    useEffect(() => {
        if (auth.authenticate && auth.user) {
            fetchUserData();
        }
    }, [auth.authenticate, auth.user]);

    const fetchUserData = async () => {
        try {
            const token = JSON.parse(sessionStorage.getItem("accessToken"));
            if (!token) return;

            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/${auth.user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAcceptedRequests(new Set(res.data.connections));
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    // 🔥 Send request
    const sendConnectionRequest = async (id) => {
        try {
            const token = JSON.parse(sessionStorage.getItem("accessToken"));
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/connect/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast({
                title: "Request sent",
                description: "Connection request sent successfully",
                position: "top-right"
            });

            setSentRequests(prev => new Set([...prev, id]));
        } catch (error) {
            console.error("Error sending request:", error.response?.data || error.message);
            toast({
                title: "Request Already sent",
                description: "You've already sent a connection request",
                position: "top-right",
                variant: "destructive"
            });
        }
    };

    // 🔥 Keyword search effect
    useEffect(() => {
        if (keyword.trim().length >= 3) {
            const delayDebounce = setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
                dispatch(getSearchResults(keyword));
            }, 1000);
            return () => clearTimeout(delayDebounce);
        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        }
    }, [keyword]);

    // 🔥 Fetch Profile Data + who added me
    useEffect(() => {
        const fetchProfiles = async () => {
            const token = JSON.parse(sessionStorage.getItem("accessToken"));
            if (!searchResults.length || !token) return;

            const profiles = {};
            const whoAddedMe = [];

            await Promise.all(searchResults.map(async (student) => {
                try {
                    const profileRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students/${student._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    profiles[student._id] = profileRes.data;

                    if (student.connections.includes(auth.user._id)) {
                        whoAddedMe.push(student._id);
                    }
                } catch (error) {
                    console.error(`Error fetching profile for ${student._id}:`, error);
                }
            }));

            setProfileData(profiles);
            setStudentsWhoAddedMe(new Set(whoAddedMe));
        };

        fetchProfiles();
    }, [searchResults]);





    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };


    const fetchBoughtCourses = async (studentId) => {
        try {
            const token = JSON.parse(sessionStorage.getItem("accessToken"));
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/student/courses-bought/get/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const courses = res.data.data || [];
            const courseTitles = courses.map(course => course.title);
            setBoughtCoursesInfo((prev) => ({
                ...prev,
                [studentId]: courseTitles,
            }));
        } catch (error) {
            console.error('Error fetching bought courses:', error);
        }
    };



    console.log(boughtCoursesInfo)




    return (
        <div className="container mx-auto md:px-6 px-4 py-8 mb-28 mt-16">
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <Input
                        value={keyword}
                        name="keyword"
                        onChange={(event) => setKeyword(event.target.value)}
                        className="py-6"
                        placeholder="Search Students..."
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {
                    searchResults && searchResults.length ? searchResults.map(student => {
                        const studentProfile = profileData[student._id];
                        const isAlreadyConnected = acceptedRequests.has(student._id) || studentsWhoAddedMe.has(student._id);
                        const isRequestSent = sentRequests.has(student._id);

                        return (
                            <div>
                                <Dialog key={student._id}>
                                    <DialogTrigger asChild>
                                        <Card className="cursor-pointer">
                                            <CardContent className="gap-4 p-4">
                                                <div className="w-full h-full flex-shrink-0 text-center">
                                                    <img
                                                        src={studentProfile?.imageUrl || "not-found.png"}
                                                        alt="Profile"
                                                        className="w-20 h-20 object-cover rounded-full mx-auto cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedStudent(studentProfile);
                                                            fetchBoughtCourses(student._id);
                                                        }}
                                                    />
                                                    <h1 className="text-center mt-2">{student?.userName}</h1>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </DialogTrigger>


                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{student.userName}</DialogTitle>
                                        </DialogHeader>

                                        {selectedStudent ? (
                                            <div className="text-center p-4">
                                                <img
                                                    src={selectedStudent.imageUrl || "not-found.png"}
                                                    alt="Profile"
                                                    className="w-32 h-32 object-cover rounded-full mx-auto"
                                                />
                                                <p className="text-lg"><strong>{selectedStudent?.about}</strong></p>

                                                <div className="mt-4">
                                                    <ul>
                                                        <li><strong>Class:</strong> {selectedStudent?.class}</li>
                                                        <li><strong>College:</strong> {selectedStudent?.collegeName}</li>
                                                        <li><strong>University:</strong> {selectedStudent?.universityName}</li>
                                                        <li><strong>DOB:</strong> {selectedStudent?.dob}</li>
                                                        <li><strong>Connections:</strong> {student?.connections?.length}</li>
                                                        {isAlreadyConnected && selectedStudent?.phoneNo && (
                                                            <li><strong>Email:</strong> {student?.userEmail}</li>
                                                        )}
                                                    </ul>
                                                </div>


                                                <div className="text-left w-full">
                                                    <div
                                                        className="flex items-center cursor-pointer hover:opacity-90 gap-2"
                                                        onClick={handleToggle}
                                                    >

                                                        <strong className="text-blue-600">{boughtCoursesInfo[student._id]?.length > 1 ? "Bought Courses:" : "Bought Course:"} {boughtCoursesInfo[student._id]?.length || 0}</strong>
                                                        <span className="ml-auto text-sm text-gray-500">{isOpen ? "▲" : "▼"}</span>
                                                    </div>

                                                    <AnimatePresence initial={false}>
                                                        {isOpen && boughtCoursesInfo[student._id]?.length > 0 && (
                                                            <motion.ul
                                                                className="list-none ml-6 mt-2 space-y-1 text-sm"
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                            >
                                                                {boughtCoursesInfo[student._id].map((title, index) => (
                                                                    <li key={index} className="text-muted-foreground">
                                                                        {index + 1} {title.toUpperCase()}
                                                                    </li>
                                                                ))}
                                                            </motion.ul>
                                                        )}
                                                    </AnimatePresence>

                                                    <AnimatePresence initial={false}>
                                                        {isOpen && boughtCoursesInfo[student._id]?.length === 0 && (
                                                            <motion.p
                                                                className="ml-6 mt-2 text-xs text-gray-500"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                No courses bought yet.
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>




                                            </div>
                                        ) : (
                                            <div className="flex justify-center items-center h-40">
                                                <p className="text-gray-500">No profile found...</p>

                                            </div>
                                        )}

                                        <DialogFooter>
                                            <button
                                                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isAlreadyConnected || isRequestSent
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                                    }`}
                                                onClick={() => sendConnectionRequest(student._id)}
                                                disabled={isAlreadyConnected || isRequestSent}
                                            >
                                                <UserPlus size={18} />
                                                {isAlreadyConnected ? "Connected" : isRequestSent ? "Sent" : "Connect"}
                                            </button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                            </div>
                        );
                    }) :
                        <div className=" items-center justify-center text-center ">
                            <p className="text-gray-500 text-center col-span-full">No students found.</p>
                            <img src="searchbar.png" alt="No results" className="mx-auto mt-2 md:ml-60 lg:ml-[484px]" />
                        </div>
                }


            </div>

            <div>
                <Button className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 "
                    onClick={() => navigate("/students")}
                >
                    <ArrowLeft className="h-5 w-5" /> back
                </Button>
            </div>

        </div>
    );
}

export default SearchPage;

