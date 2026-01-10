import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FileCheck
} from "lucide-react";
import useUserAuth from "../../hooks/useUserAuth";
import { getInitials } from "../../utils/formatters";

// Primary navigation - shown directly in navbar
const PRIMARY_LINKS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Colleges", path: "/colleges", icon: GraduationCap },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Blogs", path: "/blogs", icon: FileText },
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
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, isLoading, logout } = useUserAuth();

  const resourcesRef = useRef(null);
  const moreRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setResourcesOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-tight">
                EntranceGateway
              </span>
              <span className="text-[10px] text-gray-500 -mt-0.5">Your Path to Success</span>
            </div>
          </Link>

          {/* DESKTOP NAV - CENTER */}
          <div className="hidden lg:flex items-center gap-0.5">
            {/* Primary Links */}
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 rounded-lg transition-colors relative group"
              >
                <link.icon size={16} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-4/5 transition-all duration-200" />
              </Link>
            ))}

            {/* Resources Dropdown (Mega Menu) */}
            <div
              ref={resourcesRef}
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  resourcesOpen ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Resources
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              <div
                className={`absolute left-0 top-full pt-2 transition-all duration-200 ${
                  resourcesOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[280px]">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                    Study Materials
                  </p>
                  <div className="space-y-1">
                    {STUDY_MATERIALS.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setResourcesOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-orange-50 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shrink-0 group-hover:from-orange-200 group-hover:to-orange-100 transition-colors">
                          <item.icon size={18} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* More Dropdown */}
            <div
              ref={moreRef}
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  moreOpen ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600"
                }`}
              >
                More
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`absolute left-0 top-full pt-2 transition-all duration-200 ${
                  moreOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none"
                }`}
              >
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                  {MORE_LINKS.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <item.icon size={16} className="text-gray-400" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - Auth */}
          <div className="hidden lg:flex items-center gap-2">
            {!isLoading && (
              user ? (
                <div
                  ref={profileRef}
                  className="relative"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                      {getInitials(user.fullname)}
                    </div>
                    <div className="text-left max-w-[120px]">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {user.fullname || "User"}
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  <div
                    className={`absolute right-0 top-full pt-2 transition-all duration-200 ${
                      profileOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[240px]">
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                        <p className="text-sm font-semibold text-gray-900">{user.fullname}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                          <Mail size={12} />
                          {user.email}
                        </p>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <Link
                          to="/change-password"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <Key size={16} />
                          Change Password
                        </Link>
                        <div className="h-px bg-gray-100 mx-3 my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm px-4 py-2 text-gray-700 font-medium hover:text-orange-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-4 py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Primary Links */}
            <div className="space-y-1">
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <link.icon size={20} className="text-gray-500" />
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Study Materials Section */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                Study Materials
              </p>
              <div className="space-y-1">
                {STUDY_MATERIALS.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <item.icon size={16} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* More Links */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                More
              </p>
              <div className="space-y-1">
                {MORE_LINKS.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <item.icon size={18} className="text-gray-500" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth Section */}
            <div className="border-t border-gray-100 pt-4">
              {!isLoading && (
                user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(user.fullname)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.fullname}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 rounded-lg">
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 rounded-lg">
                        <User size={18} />
                        Profile
                      </Link>
                      <Link to="/change-password" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 rounded-lg">
                        <Key size={18} />
                        Change Password
                      </Link>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center py-3 text-orange-600 font-semibold border border-orange-500 rounded-lg hover:bg-orange-50 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-md transition"
                    >
                      Sign Up
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;