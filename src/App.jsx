import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";

import Dashboard from "./pages/Dashboard";
import StepRegister from "./pages/Register/Register";
import store from "../store/store";
import StepOTP from "./pages/Register/StepOTP";
import { initializeAuth } from "../store/authSlice";
import NotesGrid from "./pages/notes/notesGrid";
import NoteDetails from "./pages/notes/NoteDetails";
import CoursesPage from "./pages/notes/course/CoursesPage";
import CourseDetails from "./pages/notes/course/CourseDetails";
import NotesPage from "./pages/notes/NotePage";
import SyllabusPage from "./pages/Register/SyllabusPage";
import SyllabusCard from "./components/common/NoteCard/SyllabusCard";
import SyllabusDetails from "./pages/syllabus/SyllabusDetails";
import CollegeDetailPage from "./pages/Colleges/collegesDetail";
import CollegesPage from "./pages/Colleges/CollegePages";
import Blogs from "./pages/blogs/BlogPage";
import BlogDetails from "./pages/blogs/BlogDetails";
import AddNotice from "./pages/notice/addNotice";
import NoticeDetails from "./pages/notice/noticeDetails";
import BlogP from "./components/Pagination/hh";
import ContactPage from "./pages/Contact/contactPage";
import ChangePassword from "./pages/Password/changePassword";
import ForgotPassword from "./pages/Password/ForgotPassword";
import Login from "./pages/Register/Userlogin";
import ProfilePage from "./pages/profile/profilePage";
import OldQuestionsPage from "./pages/oldQuestions/OldQuestionsPage";
import OldQuestionDetails from "./pages/oldQuestions/OldQuestionDetails";

/**
 * AuthInitializer - Restores user session on page load/refresh
 * Must be used INSIDE Provider component
 */
function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          await dispatch(initializeAuth());
        } catch (error) {
          console.error("Session restore failed:", error);
        }
      }
      setIsInitialized(true);
    };

    restoreSession();
  }, [dispatch]);

  // Show loading spinner while restoring session
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}

/**
 * AppRoutes - All application routes
 * Wrapped by AuthInitializer to ensure session is restored first
 */
function AppRoutes() {
  return (
    <AuthInitializer>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<StepRegister />} />
        <Route path="/verify-otp" element={<StepOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/notes/:course/:sem" element={<NotesGrid />} />
        <Route path="/note/:id" element={<NoteDetails />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/syllabus" element={<SyllabusPage />} />
        <Route path="/syllabus/:id" element={<SyllabusDetails />} />
        <Route path="/colleges" element={<CollegesPage />} />
        <Route path="/colleges/:id" element={<CollegeDetailPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/notices" element={<AddNotice />} />
        <Route path="/notices/:id" element={<NoticeDetails />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/blogp" element={<BlogP />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/old-questions" element={<OldQuestionsPage />} />
        <Route path="/old-questions/:id" element={<OldQuestionDetails />} />
      </Routes>
    </AuthInitializer>
  );
}

/**
 * App - Main application component
 * Provider must wrap everything that uses Redux
 */
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
