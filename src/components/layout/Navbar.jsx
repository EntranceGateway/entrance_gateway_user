import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NotebookText, FileText, GraduationCap, Menu, X, ChevronDown, LogOut, User, Settings } from "lucide-react";

/* ========= CONFIG: Academic Programs ========= */
const ACADEMIC_PROGRAMS = [
  { label: "BCA", courseName: "bca" },
  { label: "CSIT", courseName: "csit" },
  { label: "BIM", courseName: "bim" },
  { label: "BBM", courseName: "bbm" },
];
const SEMESTERS = Array.from({ length: 8 }, (_, i) => ({
  label: `${i + 1}${i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"} Semester`,
  sem: i + 1,
}));
const academicMenu = ACADEMIC_PROGRAMS.map(course => ({
  label: course.label,
  courseName: course.courseName,
  semesters: SEMESTERS,
}));

/* ========= CONFIG: Entrance Exams ========= */
const ENTRANCE_EXAMS = [
  {
    label: "BCA Entrance",
    examKey: "bca-entrance",
    subjects: [
      { label: "General Knowledge", subject: "gk" },
      { label: "English", subject: "english" },
      { label: "Mathematics", subject: "math" },
      { label: "Logical Reasoning", subject: "logical" },
    ],
  },
  {
    label: "CSIT Entrance",
    examKey: "csit-entrance",
    subjects: [
      { label: "General Knowledge", subject: "gk" },
      { label: "English", subject: "english" },
      { label: "Mathematics", subject: "math" },
      { label: "Physics", subject: "physics" },
      { label: "Chemistry", subject: "chemistry" },
    ],
  },
];

/* ========= MAIN NAVBAR COMPONENT ========= */
export default function Navbar({ onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await fetch("http://185.177.116.173:8080/api/v1/user/getUserDetails", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    if (onLogout) onLogout();
    setIsMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.trim().split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-600 flex-shrink-0">
            Entrance_Gateway
          </Link>

          {/* Desktop Menu - STRICT ORDER PRESERVED */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {/* 1. Entrance Prep (Highest Priority) */}
            <EntrancePrepDropdown label="Entrance Prep" icon={<GraduationCap className="w-4 h-4" />} menu={ENTRANCE_EXAMS} />

            {/* 2. Notes */}
            <CourseDropdown label="Notes" menu={academicMenu} icon={<NotebookText className="w-4 h-4" />} baseUrl="/notes" />

            {/* 3. Syllabus */}
            <CourseDropdown label="Syllabus" menu={academicMenu} icon={<FileText className="w-4 h-4" />} baseUrl="/syllabus" />

            {/* 4. Colleges */}
            <NavLink to="/College" active={isActive("/College")}>Colleges</NavLink>

            {/* 5. Programs */}
            <Dropdown label="Programs" links={[
              { label: "TU Program", to: "/tuProgramList" },
              { label: "KU Program", to: "/kuProgramList" },
              { label: "PU Program", to: "/purProgramList" },
              { label: "PU (Pokhara)", to: "/puProgramList" },
            ]} />

            {/* 6. University */}
            <Dropdown label="University" links={[
              { label: "Tribhuwan University", to: "/tribhuwan-university" },
              { label: "Kathmandu University", to: "/kathmandu-university" },
              { label: "Pokhara University", to: "/pokhara-university" },
              { label: "Purbanchal University", to: "/purbanchal-university" },
            ]} />

            {/* 7. Training/Courses */}
            <NavLink to="/training-courses" active={isActive("/training-courses")}>Training/Courses</NavLink>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {loadingUser ? (
              <div className="w-32 h-9 bg-gray-200 rounded animate-pulse" />
            ) : user ? (
              <UserDropdown user={user} getInitials={getInitials} onLogout={handleLogout} />
            ) : (
              <>
                <Link to="/login" className="text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-100 transition">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-600 text-white text-sm px-5 py-2 rounded-md hover:bg-blue-700 transition shadow-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            {user && !loadingUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-100">
                {getInitials(user.fullname)}
              </div>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - SAME STRICT ORDER */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 absolute left-0 right-0 z-40">
          <div className="px-4 py-4 space-y-2 text-sm">
            {/* 1. Entrance Prep */}
            <MobileEntrancePrepDropdown label="Entrance Prep" menu={ENTRANCE_EXAMS} onLinkClick={() => setIsMenuOpen(false)} />

            {/* 2. Notes */}
            <MobileCourseDropdown label="Notes" menu={academicMenu} baseUrl="/notes" onLinkClick={() => setIsMenuOpen(false)} />

            {/* 3. Syllabus */}
            <MobileCourseDropdown label="Syllabus" menu={academicMenu} baseUrl="/syllabus" onLinkClick={() => setIsMenuOpen(false)} />

            {/* 4. Colleges */}
            <MobileNavLink to="/College" onClick={() => setIsMenuOpen(false)}>Colleges</MobileNavLink>

            {/* 5. Programs */}
            <MobileDropdown label="Programs" links={[
              { label: "TU Program", to: "/tuProgramList" },
              { label: "KU Program", to: "/kuProgramList" },
              { label: "PU Program", to: "/purProgramList" },
              { label: "PU (Pokhara)", to: "/puProgramList" },
            ]} onLinkClick={() => setIsMenuOpen(false)} />

            {/* 6. University */}
            <MobileDropdown label="University" links={[
              { label: "Tribhuwan University", to: "/tribhuwan-university" },
              { label: "Kathmandu University", to: "/kathmandu-university" },
              { label: "Pokhara University", to: "/pokhara-university" },
              { label: "Purbanchal University", to: "/purbanchal-university" },
            ]} onLinkClick={() => setIsMenuOpen(false)} />

            {/* 7. Training/Courses */}
            <MobileNavLink to="/training-courses" onClick={() => setIsMenuOpen(false)}>Training/Courses</MobileNavLink>

            <div className="border-t pt-4 mt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 pb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base">
                      {getInitials(user.fullname)}
                    </div>
                    <div>
                      <p className="font-semibold">{user.fullname}</p>
                      <p className="text-xs text-gray-500">Student Account</p>
                    </div>
                  </div>
                  <MobileMenuItem to="/profile" icon={<User className="w-4 h-4" />} onClick={() => setIsMenuOpen(false)}>Profile</MobileMenuItem>
                  <MobileMenuItem to="/settings" icon={<Settings className="w-4 h-4" />} onClick={() => setIsMenuOpen(false)}>Settings</MobileMenuItem>
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 text-sm rounded-md hover:bg-red-700 transition">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-center py-2.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block text-center py-2.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

/* =============== COMPONENTS =============== */
const NavLink = ({ to, children, active }) => (
  <Link to={to} className={`text-sm font-medium text-gray-700 hover:text-blue-600 transition ${active ? "text-blue-600" : ""}`}>
    {children}
  </Link>
);

const Dropdown = ({ label, links }) => (
  <div className="relative group">
    <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
      {label} <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition" />
    </button>
    <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      {links.map(l => (
        <Link key={l.label} to={l.to} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
          {l.label}
        </Link>
      ))}
    </div>
  </div>
);

const CourseDropdown = ({ label, menu, icon, baseUrl }) => (
  <div className="relative group">
    <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
      {icon} <span>{label}</span>
      <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition" />
    </button>
    <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      {menu.map(course => (
        <div key={course.courseName} className="group/course relative">
          <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
            {course.label} <ChevronDown className="w-3 h-3 text-gray-500 rotate-[-90deg]" />
          </div>
          <div className="absolute top-0 left-full ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/course:opacity-100 group-hover/course:visible transition-all duration-200 z-50">
            {course.semesters.map(s => (
              <Link
                key={s.sem}
                to={`${baseUrl}/${course.courseName}/${s.sem}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EntrancePrepDropdown = ({ label, icon, menu }) => (
  <div className="relative group">
    <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
      {icon} <span>{label}</span>
      <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition" />
    </button>
    <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      {menu.map(exam => (
        <div key={exam.examKey} className="group/exam relative">
          <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
            {exam.label} <ChevronDown className="w-3 h-3 text-gray-500 rotate-[-90deg]" />
          </div>
          <div className="absolute top-0 left-full ml-1 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/exam:opacity-100 group-hover/exam:visible transition-all duration-200 z-50">
            {exam.subjects.map(sub => (
              <div key={sub.subject} className="group/sub relative">
                <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                  {sub.label} <ChevronDown className="w-3 h-3 text-gray-500 rotate-[-90deg]" />
                </div>
                <div className="absolute top-0 left-full ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 z-50">
                  <Link to={`/notes/${exam.examKey}/${sub.subject}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                    Notes
                  </Link>
                  <Link to={`/syllabus/${exam.examKey}/${sub.subject}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                    Syllabus
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UserDropdown = ({ user, getInitials, onLogout }) => (
  <div className="relative group">
    <button className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 transition">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100">
        {getInitials(user.fullname)}
      </div>
      <ChevronDown className="w-3 h-3 text-gray-500 group-hover:rotate-180 transition" />
    </button>
    <div className="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl">
        <p className="font-semibold text-sm">{user.fullname}</p>
        <p className="text-xs opacity-90">{user.email || "student@entrancegateway.com"}</p>
      </div>
      <div className="p-2 space-y-1">
        <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition">
          <User className="w-4 h-4" /> Profile
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition">
          <Settings className="w-4 h-4" /> Settings
        </Link>
        <div className="border-t my-1"></div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  </div>
);

/* =============== MOBILE COMPONENTS =============== */
const MobileNavLink = ({ to, children, onClick }) => (
  <Link to={to} onClick={onClick} className="block py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded-md px-4 transition">
    {children}
  </Link>
);

const MobileMenuItem = ({ to, children, icon, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition">
    {icon} {children}
  </Link>
);

const MobileDropdown = ({ label, links, onLinkClick }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded-md transition">
        {label} <ChevronDown className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && links.map(l => (
        <Link key={l.label} to={l.to} onClick={onLinkClick} className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-100 transition">
          {l.label}
        </Link>
      ))}
    </div>
  );
};

const MobileCourseDropdown = ({ label, menu, baseUrl, onLinkClick }) => {
  const [open, setOpen] = useState(false);
  const [openCourse, setOpenCourse] = useState(null);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded-md transition">
        {label} <ChevronDown className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && menu.map(course => (
        <div key={course.courseName}>
          <button onClick={() => setOpenCourse(openCourse === course.label ? null : course.label)} className="w-full flex justify-between items-center px-8 py-2 text-sm text-gray-600 hover:bg-gray-100 transition">
            {course.label}
            <ChevronDown className={`w-4 h-4 transition ${openCourse === course.label ? "rotate-180" : ""}`} />
          </button>
          {openCourse === course.label && course.semesters.map(s => (
            <Link key={s.sem} to={`${baseUrl}/${course.courseName}/${s.sem}`} onClick={onLinkClick} className="block px-12 py-1.5 text-xs text-gray-500 hover:bg-gray-100 transition">
              {s.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

const MobileEntrancePrepDropdown = ({ label, menu, onLinkClick }) => {
  const [open, setOpen] = useState(false);
  const [openExam, setOpenExam] = useState(null);
  const [openSubject, setOpenSubject] = useState(null);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded-md transition">
        {label} <ChevronDown className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && menu.map(exam => (
        <div key={exam.examKey}>
          <button onClick={() => setOpenExam(openExam === exam.label ? null : exam.label)} className="w-full flex justify-between items-center px-8 py-2 text-sm text-gray-600 hover:bg-gray-100 transition">
            {exam.label}
            <ChevronDown className={`w-4 h-4 transition ${openExam === exam.label ? "rotate-180" : ""}`} />
          </button>
          {openExam === exam.label && exam.subjects.map(sub => (
            <div key={sub.subject}>
              <button onClick={() => setOpenSubject(openSubject === sub.label ? null : sub.label)} className="w-full flex justify-between items-center px-12 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition">
                {sub.label}
                <ChevronDown className={`w-4 h-4 transition ${openSubject === sub.label ? "rotate-180" : ""}`} />
              </button>
              {openSubject === sub.label && (
                <div className="pl-16 space-y-1">
                  <Link to={`/notes/${exam.examKey}/${sub.subject}`} onClick={onLinkClick} className="block py-1 text-xs text-blue-600">
                    ▸ Notes
                  </Link>
                  <Link to={`/syllabus/${exam.examKey}/${sub.subject}`} onClick={onLinkClick} className="block py-1 text-xs text-gray-600 italic">
                    ▸ Syllabus
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};