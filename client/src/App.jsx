import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import RouteGuard from './components/route-guard'
import StudentViewCommonLayout from './components/student-view/common-layout'
import StudentList from './components/StudentList'
import { AuthContext } from './context/auth-context'
import AuthPage from './pages/auth'
import InstructorDashboardPage from './pages/instructor'
import AddNewCoursePage from './pages/instructor/add-new-course'
import NotFoundPage from './pages/not-found'
import ConnectionsPage from './pages/student/connections'
import StudentViewCourseDetailsPage from './pages/student/course-details'
import StudentViewCourseProgressPage from './pages/student/course-progress'
import StudentViewCoursesPage from './pages/student/courses'
import StudentHomePage from './pages/student/home'
import PaypalPaymentReturnPage from './pages/student/payment-return'
import ParentComponent from './pages/student/pendingreq'
import SearchPage from './pages/student/search'
import StudentCoursesPage from './pages/student/student-courses'

import Chat from './components/Chat'
import QuizGenerator from './components/quizeGenerator'
import { Toaster } from './components/ui/toaster'
import Community from './pages/student/community'
import ForgotPassword from './pages/student/ForgotPassword'
import PrivacyPolicy from './pages/student/privacy-policy'
import StudentProfile from './pages/student/profile'
import RefundPolicy from './pages/student/refundPolicy'
import Help from './pages/student/support'
import TermsCondition from './pages/student/terms&condition'



const App = () => {

  const { auth } = useContext(AuthContext)

  const currentUserId = auth?.user?._id; // Adjust this based on your auth structure
  const authToken = auth?.token; // Ensure token is available


  return (
    <div >

      <Toaster />


      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              element={<AuthPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor"
          element={
            <RouteGuard
              element={<InstructorDashboardPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        >

        </Route>


        <Route
          path="/instructor/create-new-course"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />



        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />




        <Route path='/'
          element={
            <RouteGuard
              element={<StudentViewCommonLayout />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        >



          <Route path='' element={<StudentHomePage />} />

          <Route path='home' element={<StudentHomePage />} />

          <Route path='courses' element={<StudentViewCoursesPage />} />

          <Route path='course/details/:id' element={<StudentViewCourseDetailsPage />} />

          <Route path='payment-return' element={<PaypalPaymentReturnPage />} />

          <Route path='student-courses' element={<StudentCoursesPage />} />

          <Route path='course-progress/:id' element={<StudentViewCourseProgressPage />} />

          <Route path="search" element={<SearchPage />} />

          <Route path="/students" element={<StudentList />} />

          <Route path="/connections" element={<ConnectionsPage />} />

          <Route path="/pending" element={<ParentComponent />} />

          <Route path="/chat/:id" element={<Chat userId={currentUserId} token={authToken} />} />

          <Route path="/community" element={<Community />} />

          <Route path="/profile/:id" element={<StudentProfile />} />

          <Route path="/support" element={<Help />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="/refund-policy" element={<RefundPolicy />} />

          <Route path="/terms" element={<TermsCondition />} />



          <Route path="/quiz-generator" element={<QuizGenerator />} />








        </Route>



        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>

    </div>
  )
}

export default App

