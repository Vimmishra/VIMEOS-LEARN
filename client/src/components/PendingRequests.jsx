/*
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

const PendingRequests = ({ userId, token }) => {
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState(null);
    const [acceptedRequests, setAcceptedRequests] = useState(new Set());
    const [profileData, setProfileData] = useState(null);
    const [boughtCoursesInfo, setBoughtCoursesInfo] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        fetchUserData();
        fetchAllUsers();
    }, [userId, token]);

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
            setAcceptedRequests(new Set(res.data.connections));
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };


    const fetchStudentProfile = async (id) => {
        try {
            const token = JSON.parse(sessionStorage.getItem("accessToken"));
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfileData(res.data);
        } catch (error) {
            console.error("Error fetching student profile:", error);
            setProfileData(null);
        }
    };







    const acceptRequest = async (id) => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/accept/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({ title: "Request accepted", description: "Request accepted successfully.", duration: 3000 });
            setAcceptedRequests((prev) => new Set([...prev, id]));
            setUser((prevUser) => ({
                ...prevUser,
                pendingRequests: prevUser.pendingRequests.filter((reqId) => reqId !== id),
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Error accepting request");
        }
    };

    const rejectRequest = async (id) => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/reject/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({ title: "Request rejected", description: "Request rejected successfully.", duration: 3000 });
            setUser((prevUser) => ({
                ...prevUser,
                pendingRequests: prevUser.pendingRequests.filter((reqId) => reqId !== id),
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Error rejecting request");
        }
    };

    const removeConnection = async (id) => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/remove/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({ title: "Connection removed", description: "Connection removed successfully.", duration: 3000 });
            setAcceptedRequests((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        } catch (err) {
            alert(err.response?.data?.message || "Error removing connection");
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




    const startChat = (id) => {
        navigate(`/chat/${id}`);
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="space-y-6 p-4 mb-16 ">
            <h2 className="text-xl font-semibold text-center">Connection Requests</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-4 shadow-md rounded-md w-full">
                    <h3 className="text-lg font-semibold mb-3 text-center">Pending Requests</h3>
                    {user.pendingRequests.length > 0 ? (
                        user.pendingRequests.filter((id) => !acceptedRequests.has(id)).map((id) => {
                            const requestUser = requests.find((u) => u._id === id);
                            return requestUser ? (
                                <div key={id} className="flex items-center justify-between p-2 border-b">

                                    <div className="flex items-center gap-3">


                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <img src={profileData?.imageUrl ? profileData?.imageUrl : "/not-found.png"}
                                                    alt="Profile"
                                                    className="w-10 h-10 object-cover rounded-full cursor-pointer"
                                                    onClick={() => {

                                                        fetchStudentProfile(id)
                                                        fetchBoughtCourses(id)


                                                    }} />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        <h2 className="text-2xl">{requestUser.userName}</h2>
                                                    </DialogTitle>
                                                </DialogHeader>
                                                {profileData ? (

                                                    <div className="text-center p-4">

                                                        <img src={profileData.imageUrl || "/default-profile.png"}
                                                            alt="Profile"
                                                            className="w-32 h-32 object-cover rounded-full mx-auto" />
                                                        <p><strong>{profileData.about}</strong> </p>

                                                        <div className="mt-4">
                                                            <p><strong>Class:</strong> {profileData.class}</p>
                                                            <p><strong>College:</strong> {profileData.collegeName}</p>
                                                            <p><strong>University:</strong> {profileData.universityName}</p>
                                                            <p><strong>DOB:</strong> {profileData.dob}</p>
                                                            <p><strong>Connections:</strong> {requestUser?.connections.length}</p>
                                                        </div>



                                                        <div className="text-left w-full">
                                                            <div
                                                                className="flex items-center cursor-pointer hover:opacity-90 gap-2"
                                                                onClick={handleToggle}
                                                            >

                                                                <strong className="text-blue-600">{boughtCoursesInfo[requestUser._id]?.length > 1 ? "Bought Courses:" : "Bought Course:"} {boughtCoursesInfo[requestUser._id]?.length || 0}</strong>
                                                                <span className="ml-auto text-sm text-gray-500">{isOpen ? "▲" : "▼"}</span>
                                                            </div>

                                                            <AnimatePresence initial={false}>
                                                                {isOpen && boughtCoursesInfo[requestUser._id]?.length > 0 && (
                                                                    <motion.ul
                                                                        className="list-none ml-6 mt-2 space-y-1 text-sm"
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                    >
                                                                        {boughtCoursesInfo[requestUser._id].map((title, index) => (
                                                                            <li key={index} className="text-muted-foreground">
                                                                                {index + 1} {title.toUpperCase()}
                                                                            </li>
                                                                        ))}
                                                                    </motion.ul>
                                                                )}
                                                            </AnimatePresence>

                                                            <AnimatePresence initial={false}>
                                                                {isOpen && boughtCoursesInfo[requestUser._id]?.length === 0 && (
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

                                                        <div className="mt-4">
                                                            <DialogFooter className="flex flex-col justify-center mt-4">
                                                                <MapPin className="h-6 w-6" />
                                                                <p><strong>{profileData?.address}</strong></p>
                                                            </DialogFooter>
                                                        </div>


                                                    </div>
                                                ) : (
                                                    <div>
                                                        <UserCircle size={64} className="mx-auto" />
                                                        <p className="text-center">No profile found</p>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                        <span className="text-md font-semibold">{requestUser.userName}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-white"
                                            onClick={() => acceptRequest(id)}>Accept</button>
                                        <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white"
                                            onClick={() => rejectRequest(id)}>Reject</button>
                                    </div>
                                </div>
                            ) : null;
                        })
                    ) : (
                        <p className="text-center">No pending requests</p>
                    )}
                </div>


                <div className="bg-white p-4 shadow-md rounded-md w-full">
                    <h3 className="text-lg font-semibold mb-3 text-center">Accepted Connections</h3>
                    {acceptedRequests.size > 0 ? (
                        Array.from(acceptedRequests).map((id) => {
                            const requestUser = requests.find((u) => u._id === id);
                            return requestUser ? (
                                <div key={id} className="flex items-center justify-between p-2 border-b">
                                    <div className="flex items-center gap-3">

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <img src={profileData?.imageUrl ? profileData?.imageUrl : "/not-found.png"}
                                                    alt="Profile"
                                                    className="w-10 h-10 object-cover rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        fetchStudentProfile(id)
                                                        fetchBoughtCourses(id)
                                                    }} />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        <h2 className="text-2xl">{requestUser.userName}</h2>
                                                    </DialogTitle>
                                                </DialogHeader>
                                                {profileData ? (
                                                    <div className="text-center p-4">

                                                        <img src={profileData.imageUrl || "/default-profile.png"}
                                                            alt="Profile"
                                                            className="w-32 h-32 object-cover rounded-full mx-auto" />
                                                        <p><strong>{profileData?.about}</strong> </p>
                                                        <div className="mt-4 ">
                                                            <p><strong>Class:</strong> {profileData?.class}</p>
                                                            <p><strong>College:</strong> {profileData?.collegeName}</p>
                                                            <p><strong>University:</strong> {profileData?.universityName}</p>
                                                            <p><strong>DOB:</strong> {profileData?.dob}</p>
                                                            <p><strong>Email:</strong> {requestUser?.userEmail}</p>
                                                            <p><strong>Connections:</strong> {requestUser?.connections.length}</p>
                                                        </div>


                                                        <div className="text-left w-full">
                                                            <div
                                                                className="flex items-center cursor-pointer hover:opacity-90 gap-2"
                                                                onClick={handleToggle}
                                                            >

                                                                <strong className="text-blue-600">{boughtCoursesInfo[requestUser._id]?.length > 1 ? "Bought Courses:" : "Bought Course:"} {boughtCoursesInfo[requestUser._id]?.length || 0}</strong>
                                                                <span className="ml-auto text-sm text-gray-500">{isOpen ? "▲" : "▼"}</span>
                                                            </div>

                                                            <AnimatePresence initial={false}>
                                                                {isOpen && boughtCoursesInfo[requestUser._id]?.length > 0 && (
                                                                    <motion.ul
                                                                        className="list-none ml-6 mt-2 space-y-1 text-sm"
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                    >
                                                                        {boughtCoursesInfo[requestUser._id].map((title, index) => (
                                                                            <li key={index} className="text-muted-foreground">
                                                                                {index + 1} {title.toUpperCase()}
                                                                            </li>
                                                                        ))}
                                                                    </motion.ul>
                                                                )}
                                                            </AnimatePresence>

                                                            <AnimatePresence initial={false}>
                                                                {isOpen && boughtCoursesInfo[requestUser._id]?.length === 0 && (
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




                                                        <div className="mt-4">
                                                            <DialogFooter className="flex flex-col justify-center mt-4">
                                                                <MapPin className="h-6 w-6" />
                                                                <p><strong>{profileData?.address}</strong></p>
                                                            </DialogFooter>
                                                        </div>


                                                    </div>



                                                ) : (
                                                    <div>
                                                        <UserCircle size={64} className="mx-auto" />
                                                        <p className="text-center">No profile found</p>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>


                                        <span className="text-md font-semibold">{requestUser.userName}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-white"
                                            onClick={() => startChat(id)}>Chat</button>
                                        <button className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-md text-white"
                                            onClick={() => removeConnection(id)}>Remove</button>
                                    </div>
                                </div>
                            ) : null;
                        })
                    ) : (
                        <p className="text-center">No accepted connections</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingRequests;

*/




import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

const PendingRequests = ({ userId, token }) => {
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState(null);
    const [acceptedRequests, setAcceptedRequests] = useState(new Set());
    const [profileData, setProfileData] = useState(null);
    const [boughtCoursesInfo, setBoughtCoursesInfo] = useState({});
    const navigate = useNavigate();
    const [profileDataMap, setProfileDataMap] = useState({});



    useEffect(() => {
        fetchUserData();
        fetchAllUsers();
    }, [userId, token]);


    useEffect(() => {
        if (user?.pendingRequests?.length || user?.connections?.length) {
            const allIds = [...(user?.pendingRequests || []), ...(user?.connections || [])];
            allIds.forEach((id) => {
                if (!profileDataMap[id]) {
                    fetchStudentProfile(id); // Preload image data
                    fetchBoughtCourses(id); // Optional: preload bought courses if needed
                }
            });
        }
    }, [user]);


    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
            setAcceptedRequests(new Set(res.data.connections));
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const fetchStudentProfile = async (id) => {
        try {
            const token = JSON.parse(sessionStorage.getItem("accessToken"));
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfileDataMap((prev) => ({
                ...prev,
                [id]: res.data,
            }));
        } catch (error) {
            console.error("Error fetching student profile:", error);
            setProfileDataMap((prev) => ({
                ...prev,
                [id]: null,
            }));
        }
    };









    const acceptRequest = async (id) => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/accept/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({ title: "Request accepted", description: "Request accepted successfully.", duration: 3000 });
            setAcceptedRequests((prev) => new Set([...prev, id]));
            setUser((prevUser) => ({
                ...prevUser,
                pendingRequests: prevUser.pendingRequests.filter((reqId) => reqId !== id),
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Error accepting request");
        }
    };

    const rejectRequest = async (id) => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/reject/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({ title: "Request rejected", description: "Request rejected successfully.", duration: 3000 });
            setUser((prevUser) => ({
                ...prevUser,
                pendingRequests: prevUser.pendingRequests.filter((reqId) => reqId !== id),
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Error rejecting request");
        }
    };

    const removeConnection = async (id) => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/remove/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({ title: "Connection removed", description: "Connection removed successfully.", duration: 3000 });
            setAcceptedRequests((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        } catch (err) {
            alert(err.response?.data?.message || "Error removing connection");
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





    const startChat = (id) => {
        navigate(`/chat/${id}`);
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="space-y-6 p-4 mb-16 mt-20">
            <h2 className="text-xl font-semibold text-center">Connection Requests</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Pending Requests */}
                <div className="bg-white p-4 shadow-md rounded-md w-full">
                    <h3 className="text-lg font-semibold mb-3 text-center">Pending Requests</h3>
                    {user.pendingRequests.length > 0 ? (
                        user.pendingRequests
                            .filter((id) => !acceptedRequests.has(id))
                            .map((id) => {
                                const requestUser = requests.find((u) => u._id === id);
                                const profileData = profileDataMap[id];
                                const boughtCourses = boughtCoursesInfo[id] || [];

                                return requestUser ? (
                                    <div key={id} className="flex items-center justify-between p-2 border-b">
                                        <div className="flex items-center gap-3">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <img
                                                        src={profileData?.imageUrl || "/not-found.png"}
                                                        alt="Profile"
                                                        className="w-10 h-10 object-cover rounded-full cursor-pointer"
                                                        onClick={() => {
                                                            fetchStudentProfile(id);
                                                            fetchBoughtCourses(id);
                                                        }}
                                                    />
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            <h2 className="text-2xl">{requestUser.userName}</h2>
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    {profileData ? (
                                                        <div className="text-center p-4">
                                                            <img
                                                                src={profileData.imageUrl || "/default-profile.png"}
                                                                alt="Profile"
                                                                className="w-32 h-32 object-cover rounded-full mx-auto"
                                                            />
                                                            <p><strong>{profileData.about}</strong></p>
                                                            <div className="mt-4">
                                                                <p><strong>Class:</strong> {profileData.class}</p>
                                                                <p><strong>College:</strong> {profileData.collegeName}</p>
                                                                <p><strong>University:</strong> {profileData.universityName}</p>
                                                                <p><strong>DOB:</strong> {profileData.dob}</p>
                                                                <p><strong>Connections:</strong> {requestUser.connections.length}</p>
                                                            </div>

                                                            <div className="text-left w-full">
                                                                <div
                                                                    className="flex items-center cursor-pointer hover:opacity-90 gap-2"
                                                                    onClick={() => handleToggle(id)}
                                                                >
                                                                    <strong className="text-blue-600">
                                                                        {boughtCourses.length > 1 ? "Bought Courses:" : "Bought Course:"} {boughtCourses.length}
                                                                    </strong>
                                                                    <span className="ml-auto text-sm text-gray-500">{isOpen ? "▲" : "▼"}</span>
                                                                </div>

                                                                <AnimatePresence initial={false}>
                                                                    {isOpen && boughtCourses.length > 0 && (
                                                                        <motion.ul
                                                                            className="list-none ml-6 mt-2 space-y-1 text-sm"
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                        >
                                                                            {boughtCourses.map((title, index) => (
                                                                                <li key={index} className="text-muted-foreground">
                                                                                    {index + 1}. {title.toUpperCase()}
                                                                                </li>
                                                                            ))}
                                                                        </motion.ul>
                                                                    )}

                                                                    {isOpen && boughtCourses.length === 0 && (
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

                                                            <div className="mt-4">
                                                                <DialogFooter className="flex flex-col justify-center mt-4">
                                                                    <MapPin className="h-6 w-6" />
                                                                    <p><strong>{profileData?.address || "No location"}</strong></p>
                                                                </DialogFooter>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <UserCircle size={64} className="mx-auto" />
                                                            <p className="text-center">No profile found</p>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                            <span className="text-md font-semibold">{requestUser.userName}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-white"
                                                onClick={() => acceptRequest(id)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white"
                                                onClick={() => rejectRequest(id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ) : null;
                            })
                    ) : (
                        <p className="text-center">No pending requests</p>
                    )}
                </div>

                {/* Accepted Requests */}
                <div className="bg-white p-4 shadow-md rounded-md w-full">
                    <h3 className="text-lg font-semibold mb-3 text-center">Accepted Connections</h3>
                    {acceptedRequests.size > 0 ? (
                        Array.from(acceptedRequests).map((id) => {
                            const requestUser = requests.find((u) => u._id === id);
                            const profileData = profileDataMap[id];
                            const boughtCourses = boughtCoursesInfo[id] || [];

                            return requestUser ? (
                                <div key={id} className="flex items-center justify-between p-2 border-b">
                                    <div className="flex items-center gap-3">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <img
                                                    src={profileData?.imageUrl || "/not-found.png"}
                                                    alt="Profile"
                                                    className="w-10 h-10 object-cover rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        fetchStudentProfile(id);
                                                        fetchBoughtCourses(id);
                                                    }}
                                                />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        <h2 className="text-2xl">{requestUser.userName}</h2>
                                                    </DialogTitle>
                                                </DialogHeader>
                                                {profileData ? (
                                                    <div className="text-center p-4">
                                                        <img
                                                            src={profileData.imageUrl || "/default-profile.png"}
                                                            alt="Profile"
                                                            className="w-32 h-32 object-cover rounded-full mx-auto"
                                                        />
                                                        <p><strong>{profileData.about}</strong></p>
                                                        <div className="mt-4">
                                                            <p><strong>Class:</strong> {profileData.class}</p>
                                                            <p><strong>College:</strong> {profileData.collegeName}</p>
                                                            <p><strong>University:</strong> {profileData.universityName}</p>
                                                            <p><strong>DOB:</strong> {profileData.dob}</p>
                                                            <p><strong>Email:</strong> {requestUser.userEmail}</p>
                                                            <p><strong>Connections:</strong> {requestUser.connections.length}</p>
                                                        </div>

                                                        <div className="text-left w-full">
                                                            <div
                                                                className="flex items-center cursor-pointer hover:opacity-90 gap-2"
                                                                onClick={() => handleToggle(id)}
                                                            >
                                                                <strong className="text-blue-600">
                                                                    {boughtCourses.length > 1 ? "Bought Courses:" : "Bought Course:"} {boughtCourses.length}
                                                                </strong>
                                                                <span className="ml-auto text-sm text-gray-500">{isOpen ? "▲" : "▼"}</span>
                                                            </div>

                                                            <AnimatePresence initial={false}>
                                                                {isOpen && boughtCourses.length > 0 && (
                                                                    <motion.ul
                                                                        className="list-none ml-6 mt-2 space-y-1 text-sm"
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                    >
                                                                        {boughtCourses.map((title, index) => (
                                                                            <li key={index} className="text-muted-foreground">
                                                                                {index + 1}. {title.toUpperCase()}
                                                                            </li>
                                                                        ))}
                                                                    </motion.ul>
                                                                )}

                                                                {isOpen && boughtCourses.length === 0 && (
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

                                                        <div className="mt-4">
                                                            <DialogFooter className="flex flex-col justify-center mt-4">
                                                                <MapPin className="h-6 w-6" />
                                                                <p><strong>{profileData?.address || "No location"}</strong></p>
                                                            </DialogFooter>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <UserCircle size={64} className="mx-auto" />
                                                        <p className="text-center">No profile found</p>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                        <span className="text-md font-semibold">{requestUser.userName}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-white"
                                            onClick={() => startChat(id)}
                                        >
                                            Chat
                                        </button>
                                        <button
                                            className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-md text-white"
                                            onClick={() => removeConnection(id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : null;
                        })
                    ) : (
                        <p className="text-center">No accepted connections</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingRequests;