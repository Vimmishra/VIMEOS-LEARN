import { GoogleOAuthProvider } from '@react-oauth/google'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AuthProvider from './context/auth-context'
import InstructorProvider from './context/instructor-context/index.jsx'
import StudentProvider from './context/student-context/index.jsx'
import './index.css'
import store from "./store/store.js"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>

      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

        <InstructorProvider>
          <Provider store={store}>
            <StudentProvider>

              <App />

            </StudentProvider>
          </Provider>

        </InstructorProvider>

      </GoogleOAuthProvider>
    </AuthProvider>
  </BrowserRouter>

)
