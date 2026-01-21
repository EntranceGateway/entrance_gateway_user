import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Mail,
  LayoutDashboard,
  Home,
  GraduationCap,
  BookOpen,
  FileText,
  NotebookPen,
  ScrollText,
  Key,
  FileQuestion,
  Bell,
  Phone,
  Shield,
  FileCheck,Award
} from "lucide-react";
import useUserAuth from "../../hooks/useUserAuth";
import { getInitials } from "../../utils/formatters";

// Primary navigation - shown directly in navbar
const PRIMARY_LINKS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Colleges", path: "/colleges", icon: GraduationCap },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Blogs", path: "/blogs", icon: FileText },
  { name: "Trainings", path: "/training", icon: Award },
];

// Study materials dropdown (mega menu)
const STUDY_MATERIALS = [
  { name: "Notes", path: "/notes", icon: NotebookPen, description: "Study materials & notes" },
  { name: "Old Questions", path: "/old-questions", icon: FileQuestion, description: "Previous year questions" },
  { name: "Syllabus", path: "/syllabus", icon: ScrollText, description: "Course syllabus" },
];

// More links dropdown
const MORE_LINKS = [
  { name: "Notices", path: "/notices", icon: Bell },
  { name: "Contact", path: "/contact", icon: Phone },
  { name: "Privacy Policy", path: "/privacy", icon: Shield },
  { name: "Terms & Conditions", path: "/terms", icon: FileCheck },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading, logout } = useUserAuth();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-accent/10 p-2 rounded-lg">
              <span className="material-icons-round text-accent text-3xl">school</span>
            </div>
            <span className="font-display font-bold text-2xl text-accent tracking-tight">EntranceGateway</span>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {PRIMARY_LINKS.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-semibold transition-colors flex items-center gap-1.5 ${
                    location.pathname === link.path
                      ? "text-accent"
                      : "text-gray-700 hover:text-accent"
                  }`}
                >
                  <IconComponent className="w-5 h-5 opacity-70" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-5">
            {!isLoading && (
              user ? (
                <div
                  ref={profileRef}
                  className="relative"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                    <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {getInitials(user.fullname)}
                    </div>
                    <div className="text-left max-w-[120px] hidden lg:block">
                      <p className="text-sm font-medium text-gray-800 truncate">{user.fullname || "User"}</p>
                    </div>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div className={`absolute right-0 top-full pt-2 transition-all duration-200 ${profileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"}`}>
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[240px]">
                      <div className="px-4 py-3 bg-gradient-to-r from-accent/10 to-primary/10 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.fullname}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                          <Mail size={12} />
                          {user.email}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link to="/" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-accent/5 hover:text-accent transition-colors">
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-accent/5 hover:text-accent transition-colors">
                          <User size={16} />
                          Profile
                        </Link>
                        <Link to="/change-password" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-accent/5 hover:text-accent transition-colors">
                          <Key size={16} />
                          Change Password
                        </Link>
                        <div className="h-px bg-gray-100 mx-3 my-1" />
                        <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-base font-semibold text-gray-600 hover:text-accent transition-colors">Login</Link>
                  <Link to="/signup" className="bg-accent hover:bg-secondary text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg shadow-accent/20">Sign Up</Link>
                </>
              )
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
            {PRIMARY_LINKS.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? "bg-accent/10 text-accent"
                      : "text-gray-800 hover:text-accent hover:bg-accent/5"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}

            <div className="border-t border-gray-100 pt-4 mt-4">
              {!isLoading && (
                user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(user.fullname)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.fullname}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-accent/5 rounded-lg">
                      <User size={18} />
                      Profile
                    </Link>
                    <Link to="/change-password" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-accent/5 rounded-lg">
                      <Key size={18} />
                      Change Password
                    </Link>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg">
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center py-3 text-accent font-semibold border border-accent rounded-lg hover:bg-accent/5 transition">Login</Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="block w-full text-center py-3 bg-accent text-white font-semibold rounded-lg hover:bg-secondary hover:shadow-md transition">Sign Up</Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;