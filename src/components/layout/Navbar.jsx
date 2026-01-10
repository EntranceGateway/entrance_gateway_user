import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Mail,
  LayoutDashboard,
  Home,
  GraduationCap,
  BookOpen,
  FileText,
  NotebookPen,
  ScrollText,
  Key,
  FileQuestion
} from "lucide-react";
import useUserAuth from "../../hooks/useUserAuth";
import { getInitials } from "../../utils/formatters";

const MAIN_LINKS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Colleges", path: "/colleges", icon: GraduationCap },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Blogs", path: "/blogs", icon: FileText },
  { name: "Notes", path: "/notes", icon: NotebookPen },
  { name: "Old Questions", path: "/old-questions", icon: FileQuestion },
  { name: "Syllabus", path: "/syllabus", icon: ScrollText },
];

const MORE_LINKS = [
  { name: "Notices", path: "/notices" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms & Conditions", path: "/terms" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, isLoading, logout } = useUserAuth();

  const moreRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    <header className="w-full border-b border-gray-200 bg-white/95 backdrop-blur sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              EntranceGateway
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Main Links - Compact & Elegant */}
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200"
                onClick={() => {
                  setMoreOpen(false);
                  setProfileOpen(false);
                }}
              >
                <link.icon size={16} />
                <span>{link.name}</span>
              </Link>
            ))}

            {/* MORE DROPDOWN */}
            <div
              ref={moreRef}
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200"
                onClick={() => setMoreOpen(!moreOpen)}
              >
                More
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full w-52 bg-white rounded-lg shadow-lg border border-gray-100 transition-all duration-200 ease-out ${
                  moreOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-1 pointer-events-none"
                }`}
              >
                <div className="py-1">
                  {MORE_LINKS.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* AUTH SECTION */}
            {!isLoading && (
              user ? (
                <div
                  ref={profileRef}
                  className="relative ml-2"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 hover:bg-gray-200 transition-all duration-200"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {getInitials(user.fullname)}
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-xs font-semibold text-gray-800">
                        {user.fullname || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-32">
                        {user.email}
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-gray-600 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  <div
                    className={`absolute right-0 top-full mt-1 w-60 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 ease-out ${
                      profileOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.fullname}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                        <Mail size={13} />
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <Link
                        to="/change-password"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Key size={16} />
                        Change Password
                      </Link>
                      <div className="h-px bg-gray-200 mx-3 my-1" />
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
              ) : (
                <div className="flex items-center gap-3 ml-4">
                  <Link
                    to="/login"
                    className="text-sm px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium hover:shadow-md transition-all duration-200"
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
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <div className="space-y-1">
              {MAIN_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">More</p>
              {MORE_LINKS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-5">
              {!isLoading && (
                user ? (
                  <div className="space-y-4">
                    <div className="px-3">
                      <p className="font-semibold text-gray-900">{user.fullname}</p>
                      <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-gray-800 font-medium">
                      Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-gray-700">
                      Profile
                    </Link>
                    <Link to="/settings" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-gray-700">
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-red-600 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center py-3 text-blue-600 font-semibold border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:shadow-md transition"
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