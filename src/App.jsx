import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Register/userlogin";
import StepRegister from "./pages/Register/Register";
import { Provider } from "react-redux";
import store from "../store/store";
import StepOTP from "./pages/Register/StepOTP";
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

function App() {

  return (
        <Provider store={store}>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<StepRegister />} />
<Route path="/verify-otp" element={<StepOTP/>}/>
        {/* Protected Route */}
        <Route path="/" element={<Dashboard />} />
<Route path="/notes/:course/:sem" element={<NotesGrid/>}/>
<Route path="/note/:id" element={<NoteDetails />} />
<Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/notepages" element={<NotesPage />} />
      <Route path="/syllabus" element={<SyllabusPage />} />
            <Route path="/syllabus/:id" element={<SyllabusDetails/>} />
<Route path="/colleges" element={<CollegesPage />} />
<Route path="/colleges/:id" element={<CollegeDetailPage />} />
      </Routes>
    </BrowserRouter>
        </Provider>

  );
}

export default App;
