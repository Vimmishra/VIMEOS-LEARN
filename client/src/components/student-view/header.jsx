


import { AuthContext } from "@/context/auth-context";
import { motion } from "framer-motion";
import {
    BookOpen,
    Globe,
    GraduationCap,
    LogOut,
    Menu,
    Phone,
    Search,
    Target,
    TvMinimalPlay,
    UserCircle,
    UserPlus,
    Users,
    UserSearch,
    X,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const StudentViewCommonHeader = () => {
    const { resetCredentials, auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function handleLogout() {
        resetCredentials();
        sessionStorage.clear();
    }

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{ y: showHeader ? 0 : -100 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b bg-white shadow-sm"
        >
            <div className="flex items-center space-x-4">
                <Link className="flex items-center hover:text-black" to="/home">
                    <GraduationCap className="h-8 w-8 mr-2 text-orange-500" />
                    <span className="font-extrabold md:text-xl text-[14px]">
                        <span className="text-orange-500">VIMEOS</span> LEARN
                    </span>
                </Link>
                <Button
                    variant="ghost"
                    onClick={() => {
                        if (!location.pathname.includes("/courses")) {
                            navigate("/courses");
                        }
                    }}
                    className="text-[14px] md:text-[16px] font-medium"
                >
                    Explore Courses <Search className="font-bold h-4 w-4 ml-1" />
                </Button>
            </div>

            <div className="hidden md:flex items-center space-x-6">
                <div
                    onClick={() => navigate("/students")}
                    className="cursor-pointer flex items-center gap-1"
                >
                    <UserSearch className="w-6 h-6" />
                    <span className="font-bold md:text-lg"> Students</span>
                </div>

                <div
                    onClick={() => navigate("/student-courses")}
                    className="cursor-pointer flex items-center gap-2"
                >
                    <span className="font-extrabold md:text-lg"> My Courses</span>
                    <TvMinimalPlay className="w-6 h-6" />
                </div>

                <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <UserCircle className="w-8 h-8 cursor-pointer" />
                    {dropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-0 w-52 bg-white shadow-lg border rounded-xl overflow-hidden z-50"
                        >
                            <ul className="py-2  text-sm">
                                <li
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                                    onClick={() => navigate(`/profile/${auth?.user?._id}`)}
                                >
                                    <UserCircle className="w-4 h-4" /> My Profile
                                </li>
                                <li
                                    className="px-4 py-2 cursor-pointer flex items-center hover:bg-gray-100 gap-2"
                                    onClick={() => navigate("/pending")}
                                >
                                    <UserPlus className="w-4 h-4" /> My Connections
                                </li>
                                <li
                                    className="px-4 py-2 cursor-pointer flex hover:bg-gray-100 items-center gap-2"
                                    onClick={() => navigate("/quiz-generator")}
                                >
                                    <Target className="w-4 h-4" /> Quiz Zone
                                </li>
                                <li
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                                    onClick={() => navigate("/community")}
                                >
                                    <Globe className="w-4 h-4" /> Community
                                </li>
                                <li
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                                    onClick={() => navigate("/support")}
                                >
                                    <Phone className="w-4 h-4" /> Help
                                </li>
                                <li
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 text-red-600"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="md:hidden">
                <Menu className="w-8 h-8 cursor-pointer" onClick={() => setSidebarOpen(true)} />
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50"
                    onClick={() => setSidebarOpen(false)}
                >
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-600"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <nav className="mt-8 space-y-4 text-lg">
                            <div
                                onClick={() => {
                                    navigate("/students");
                                    setSidebarOpen(false);
                                }}
                                className="flex gap-x-2 cursor-pointer"
                            >
                                <Users className="w-6 h-6" /> Students
                            </div>
                            <div
                                onClick={() => {
                                    navigate("/student-courses");
                                    setSidebarOpen(false);
                                }}
                                className="flex gap-x-2 cursor-pointer"
                            >
                                <BookOpen className="w-6 h-6" /> My Courses
                            </div>
                            <div
                                onClick={() => {
                                    navigate(`/profile/${auth?.user?._id}`);
                                    setSidebarOpen(false);
                                }}
                                className="flex gap-x-2 cursor-pointer"
                            >
                                <UserCircle className="w-6 h-6" /> My Profile
                            </div>
                            <div
                                onClick={() => {
                                    navigate("/pending");
                                    setSidebarOpen(false);
                                }}
                                className="flex gap-x-2 cursor-pointer"
                            >
                                <UserPlus className="w-6 h-6" /> My Connections
                            </div>
                            <div
                                onClick={() => {
                                    navigate("/quiz-generator");
                                    setSidebarOpen(false);
                                }}
                                className="flex gap-x-2 cursor-pointer"
                            >
                                <Target className="w-6 h-6" /> Quiz Zone
                            </div>
                            <div
                                onClick={() => {
                                    navigate("/community");
                                    setSidebarOpen(false);
                                }}
                                className="flex gap-x-2 cursor-pointer"
                            >
                                <Globe className="w-6 h-6" /> Community
                            </div>
                            <div
                                onClick={() => {
                                    navigate("/support");
                                    setSidebarOpen(false);
                                }}
                                className="flex gap-x-2 cursor-pointer"
                            >
                                <Phone className="w-6 h-6" /> Help
                            </div>
                            <div
                                onClick={() => {
                                    handleLogout();
                                    setSidebarOpen(false);
                                }}
                                className="flex gap-x-2 cursor-pointer text-red-600"
                            >
                                <LogOut className="w-6 h-6" /> Logout
                            </div>
                        </nav>
                    </motion.div>
                </div>
            )}
        </motion.header>
    );
};

export default StudentViewCommonHeader;


