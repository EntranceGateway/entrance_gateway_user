import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";

// Page imports
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Register/Userlogin";
import StepRegister from "./pages/Register/Register";
import StepOTP from "./pages/Register/StepOTP";
import NotesGrid from "./pages/notes/notesGrid";
import NoteDetails from "./pages/notes/detail/NoteDetailPage";
import CoursesPage from "./pages/notes/course/CoursesPage";
import CourseDetailPage from "./pages/courses/CourseDetailPage";
import NotesPage from "./pages/notes/NotePage";
import SyllabusPage from "./pages/syllabus/SyllabusPage";
import SyllabusDetailPage from "./pages/syllabus/SyllabusDetailPage";
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
import ProfilePage from "./pages/profile/profilePage";
import OldQuestionsPage from "./pages/oldQuestions/OldQuestionsPage";
import OldQuestionDetails from "./pages/oldQuestions/OldQuestionDetails";
import TrainingsPage from "./pages/Training/TrainingsPage";
import TrainingDetail from "./pages/Training/TrainingDetail";

// Store imports
import store from "../store/store";
import { initializeAuth } from "../store/authSlice";

// ────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────
const AUTH_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

// ────────────────────────────────────────────────
// Utility Functions
// ────────────────────────────────────────────────
const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
};

const getRefreshToken = () => {
  return localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
};

const clearAuthTokens = () => {
  localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
};

// ────────────────────────────────────────────────
// Notification Component
// ────────────────────────────────────────────────
function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md flex items-center justify-between">
        <div className="flex items-center">
          <svg 
            className="w-6 h-6 mr-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Loading Screen Component
// ────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Not Found Component
// ────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600">Page not found</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Auth Initializer Component
// ────────────────────────────────────────────────
function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = getRefreshToken();
      
      if (refreshToken) {
        try {
          await dispatch(initializeAuth());
        } catch (error) {
          console.error("Session restore failed:", error);
          // Clear invalid tokens
          clearAuthTokens();
        }
      }
      
      setIsInitialized(true);
    };

    restoreSession();
  }, [dispatch]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

// ────────────────────────────────────────────────
// Route Configuration
// ────────────────────────────────────────────────
function AppRoutes() {
  return (
    <AuthInitializer>
      <Routes>
        {/* ═══════════════════════════════════════════
            Public Routes
        ═══════════════════════════════════════════ */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<StepRegister />} />
        <Route path="/verify-otp" element={<StepOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ═══════════════════════════════════════════
            Dashboard
        ═══════════════════════════════════════════ */}
        <Route path="/" element={<Dashboard />} />

        {/* ═══════════════════════════════════════════
            User Routes
        ═══════════════════════════════════════════ */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* ═══════════════════════════════════════════
            Notice Routes
        ═══════════════════════════════════════════ */}
        <Route path="/notices" element={<AddNotice />} />
        <Route path="/notices/:id" element={<NoticeDetails />} />

        {/* ═══════════════════════════════════════════
            Training Routes
        ═══════════════════════════════════════════ */}
        <Route path="/training" element={<TrainingsPage />} />
        <Route path="/training/:id" element={<TrainingDetail />} />

        {/* ═══════════════════════════════════════════
            Notes Routes
        ═══════════════════════════════════════════ */}
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:course/:sem" element={<NotesGrid />} />
        <Route path="/note/:id" element={<NoteDetails />} />

        {/* ═══════════════════════════════════════════
            Courses Routes
        ═══════════════════════════════════════════ */}
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        {/* ═══════════════════════════════════════════
            Syllabus Routes
        ═══════════════════════════════════════════ */}
        <Route path="/syllabus" element={<SyllabusPage />} />
        <Route path="/syllabus/:id" element={<SyllabusDetailPage />} />

        {/* ═══════════════════════════════════════════
            Colleges Routes
        ═══════════════════════════════════════════ */}
        <Route path="/colleges" element={<CollegesPage />} />
        <Route path="/colleges/:id" element={<CollegeDetailPage />} />

        {/* ═══════════════════════════════════════════
            Blog Routes
        ═══════════════════════════════════════════ */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/blogp" element={<BlogP />} />

        {/* ═══════════════════════════════════════════
            Old Questions Routes
        ═══════════════════════════════════════════ */}
        <Route path="/old-questions" element={<OldQuestionsPage />} />
        <Route path="/old-questions/:id" element={<OldQuestionDetails />} />

        {/* ═══════════════════════════════════════════
            Contact Route
        ═══════════════════════════════════════════ */}
        <Route path="/contact" element={<ContactPage />} />

        {/* ═══════════════════════════════════════════
            Catch-all 404 Route
        ═══════════════════════════════════════════ */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthInitializer>
  );
}

// ────────────────────────────────────────────────
// Root App Component
// ────────────────────────────────────────────────
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