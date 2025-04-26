
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AuthContext } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Search, UserCircle, UserPlus, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";


const StudentList = () => {
    const { auth } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState(new Set());
    const [studentsWhoAddedMe, setStudentsWhoAddedMe] = useState(new Set());
    const [sentRequests, setSentRequests] = useState(new Set()); // 🟢 Added for "Sent" behavior
    const [profileData, setProfileData] = useState({});

    const [boughtCoursesInfo, setBoughtCoursesInfo] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.authenticate && auth.user) {
            fetchUserData();
            fetchStudents();
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

    const fetchStudents = async () => {
        try {
            const token = JSON.parse(sessionStorage.getItem("accessToken"));
            if (!token) return;

            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const studentList = res.data.filter(student => student._id !== auth.user._id);
            setStudents(studentList);

            // Fetch profile images
            const profiles = {};
            await Promise.all(studentList.map(async (student) => {
                try {
                    const profileRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students/${student._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    profiles[student._id] = profileRes.data;
                } catch (error) {
                    console.error(`Error fetching profile for ${student._id}:`, error);
                }
            }));

            setProfileData(profiles);

            const usersWhoAddedMe = studentList.filter(student => student.connections.includes(auth.user._id));
            setStudentsWhoAddedMe(new Set(usersWhoAddedMe.map(user => user._id)));
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    // Send connection request
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

            setSentRequests((prev) => new Set([...prev, id])); // 🟢 Update Sent Requests
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



    if (!auth.authenticate || !auth.user) {
        return <p className="text-center text-red-500">User is not authenticated.</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg relative mb-8 mt-20">
            <div>
                <Button onClick={() => navigate("/search")} className="bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
                    <Search className="h-6 w-6" /> search
                </Button>
            </div>

            <button
                className="absolute top-4 right-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition"
                onClick={() => navigate("/pending")}
            >
                <Users size={18} />
                My Connections
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">Our Students</h2>

            {students.length > 0 ? (
                <ul className="space-y-3 ">
                    {students.map(student => {
                        const isAlreadyConnected = acceptedRequests.has(student._id) || studentsWhoAddedMe.has(student._id);
                        const isRequestSent = sentRequests.has(student._id);
                        const studentProfile = profileData[student._id];

                        return (
                            <li key={student._id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow">
                                <div className="flex items-center gap-3">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <img
                                                src={studentProfile?.imageUrl ? studentProfile?.imageUrl : "not-found.png"}
                                                alt="Profile"
                                                className="w-10 h-10 object-cover rounded-full cursor-pointer"
                                                onClick={() => fetchBoughtCourses(student._id)}
                                            />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{student?.userName}</DialogTitle>
                                            </DialogHeader>
                                            {studentProfile ? (
                                                <div className="text-center p-4">
                                                    <img
                                                        src={studentProfile?.imageUrl || "/not-found.png"}
                                                        alt="Profile"
                                                        className="w-32 h-32 object-cover rounded-full mx-auto"
                                                    />
                                                    <h2 className="text-2xl font-semibold mt-2">{studentProfile.userName}</h2>
                                                    <ul>
                                                        <li><strong>Class:</strong> {studentProfile.class}</li>
                                                        <li><strong>College:</strong> {studentProfile.collegeName}</li>
                                                        <li><strong>University:</strong> {studentProfile.universityName}</li>
                                                        <li><strong>DOB:</strong> {studentProfile.dob}</li>
                                                        <li><strong>Connections:</strong> {student?.connections.length}</li>
                                                        {isAlreadyConnected && (
                                                            <li><strong>Email:</strong> {student.userEmail}</li>
                                                        )}
                                                    </ul>




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



                                                    {isAlreadyConnected && studentProfile.address && (


                                                        <div className="mt-4">
                                                            <DialogFooter className="flex flex-col justify-center mt-4">
                                                                <MapPin className="h-6 w-6" />
                                                                <p><strong>{studentProfile?.address}</strong></p>
                                                            </DialogFooter>
                                                        </div>
                                                    )}


                                                </div>



                                            ) : (
                                                <div>
                                                    <UserCircle size={64} className="mx-auto" />
                                                    <p className="text-center">No profile found</p>
                                                </div>
                                            )}

                                        </DialogContent>
                                    </Dialog>

                                    <span className="text-gray-800">{student.userName}</span>
                                </div>

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
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-500 text-center">No students available.</p>
            )}
        </div>
    );
};

export default StudentList;
