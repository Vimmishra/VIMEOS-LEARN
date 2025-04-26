import { Outlet, useLocation } from "react-router-dom"
import Footer from "./footer"
import StudentViewCommonHeader from "./header"



const StudentViewCommonLayout = () => {
    const location = useLocation()
    return (
        <div>
            {
                !location.pathname.includes('course-progress') ?
                    <StudentViewCommonHeader /> : null
            }

            <Outlet />
            {
                !location.pathname.includes('course-progress') && !location.pathname.includes('chat') ? <Footer /> : null

            }
        </div>
    )
}

export default StudentViewCommonLayout
