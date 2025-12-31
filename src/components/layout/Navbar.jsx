import React, { useEffect, useState, useLayoutEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, X, School, GraduationCap, NotebookText, FileText,
  Newspaper, LayoutGrid, Cpu, Zap, Award, Globe,
  ChevronDown, User, Settings, LogOut,
} from "lucide-react";

// Constants
const MAIN_LINKS = [
  { label: "Colleges", to: "/colleges", icon: School },
  { label: "Programs", to: "/courses", icon: GraduationCap },
  { label: "Notes", to: "/notepages", icon: NotebookText },
  { label: "Syllabus", to: "/syllabus", icon: FileText },
  { label: "Blog", to: "/blog", icon: Newspaper },
];

const MORE_SUBMENU = [
  { 
    label: "Training Courses", 
    to: "/training-courses", 
    icon: Cpu, 
    desc: "Professional skill programs" 
  },
  { 
    label: "Entrance Prep", 
    to: "/entrance-prep", 
    icon: Zap, 
    desc: "Model questions & guides" 
  },
  { 
    label: "Scholarships", 
    to: "/scholarships", 
    icon: Award, 
    desc: "Funding opportunities" 
  },
  { 
    label: "Universities Info", 
    to: "/universities", 
    icon: Globe, 
    desc: "Detailed university info" 
  },
];

const API_CONFIG = {
  baseURL: "http://185.177.116.173:8080/api/v1",
  endpoints: {
    userDetails: "/user/getUserDetails",
  },
};

const STORAGE_KEYS = {
  token: "token",
  cachedUser: "cachedUser",
};

const SCROLL_THRESHOLD = 20;
const BODY_LOCK_DELAY = 100;

/**
 * Custom hook for managing body scroll lock
 * Prevents layout shift when hiding scrollbar
 */
const useBodyScrollLock = (isLocked) => {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useLayoutEffect(() => {
    // Calculate scrollbar width once on mount
    const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
    
    if (isLocked) {
      // Apply body lock with exact scrollbar width
      setScrollbarWidth(scrollWidth);
      
      // Use requestAnimationFrame to ensure smooth application
      requestAnimationFrame(() => {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollWidth}px`;
      });
    } else {
      // Delay reset to prevent flash during transitions
      const timer = setTimeout(() => {
        setScrollbarWidth(0);
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }, BODY_LOCK_DELAY);
      
      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  return scrollbarWidth;
};

/**
 * Custom hook for detecting scroll position
 */
const useScrollDetection = (threshold = SCROLL_THRESHOLD) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
};

/**
 * Custom hook for fetching and caching user data
 */
const useUserAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.token);
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Try to load from cache first
      const cachedUser = localStorage.getItem(STORAGE_KEYS.cachedUser);
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          setUser(parsedUser);
          setIsLoading(false);
          return;
        } catch (error) {
          console.warn("Failed to parse cached user data:", error);
        }
      }

      // Fetch from API
      try {
        const response = await fetch(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.userDetails}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
          localStorage.setItem(STORAGE_KEYS.cachedUser, JSON.stringify(data.data));
        } else {
          console.error("Failed to fetch user details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.cachedUser);
    setUser(null);
  }, []);

  return { user, isLoading, logout };
};

/**
 * Utility function to get user initials
 */
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

/**
 * Navigation Link Component
 */
const NavLink = ({ to, icon: Icon, label, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
      isActive
        ? "bg-blue-600 text-white shadow-md scale-105"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </Link>
);

/**
 * Mobile Navigation Link Component
 */
const MobileNavLink = ({ to, icon: Icon, label, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
      isActive 
        ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-100" 
        : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </Link>
);

/**
 * User Profile Dropdown Component
 */
const UserProfileDropdown = ({ user, onLogout }) => (
  <div className="relative group">
    <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-100 transition shadow-sm">
      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
        {getInitials(user.fullname)}
      </div>
      <div className="text-left">
        <p className="text-xs font-bold text-gray-900 leading-tight">{user.fullname}</p>
        <p className="text-[10px] text-gray-500">Student</p>
      </div>
      <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
    </button>
    
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="p-4 border-b border-gray-50">
        <p className="text-xs text-gray-400">Signed in as</p>
        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
      </div>
      <div className="p-2">
        <Link 
          to="/profile" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <User className="w-4 h-4" /> Profile
        </Link>
        <Link 
          to="/settings" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Settings className="w-4 h-4" /> Settings
        </Link>
        <hr className="my-1 border-gray-100" />
        <button 
          onClick={onLogout} 
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  </div>
);

/**
 * Main Navbar Component
 */
const Navbar = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Custom hooks
  const isScrolled = useScrollDetection();
  const scrollbarWidth = useBodyScrollLock(isMenuOpen);
  const { user, isLoading, logout } = useUserAuth();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Memoized handlers
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    if (onLogout) onLogout();
    setIsMenuOpen(false);
  }, [logout, onLogout]);

  const isActivePath = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  // Memoized values
  const navbarClasses = useMemo(
    () =>
      `fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 py-1"
          : "bg-white shadow-sm py-2"
      }`,
    [isScrolled, isMenuOpen]
  );

  const mobileMenuClasses = useMemo(
    () =>
      `lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl overflow-hidden transition-all duration-300 ${
        isMenuOpen ? "max-h-[calc(100vh-64px)] opacity-100" : "max-h-0 opacity-0"
      }`,
    [isMenuOpen]
  );

  return (
    <>
      {/* Spacer to prevent content jump */}
      <div className="h-16 md:h-20" />

      {/* Background Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] lg:hidden transition-opacity duration-300"
          onClick={handleMenuClose}
          aria-hidden="true"
        />
      )}

      {/* Main Navigation */}
      <nav
        className={navbarClasses}
        role="navigation"
        aria-label="Main navigation"
      >
        <div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ 
            paddingRight: `calc(1.5rem + ${scrollbarWidth}px)`,
            paddingLeft: '1.5rem',
            transition: 'padding 0s'
          }}
        >
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="EntranceGateway Home">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                EG
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">
                  Entrance<span className="text-blue-600">Gateway</span>
                </span>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold -mt-1">
                  Education Hub
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {MAIN_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  label={link.label}
                  isActive={isActivePath(link.to)}
                />
              ))}

              {/* More Dropdown */}
              <div className="relative group ml-2">
                <button 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all"
                  aria-haspopup="true"
                >
                  <LayoutGrid className="w-5 h-5" />
                  More
                  <ChevronDown className="w-4 h-4 transition group-hover:rotate-180" />
                </button>
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 translate-y-2 group-hover:translate-y-0">
                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-3 px-2">
                      Resources & Training
                    </p>
                    <div className="grid gap-1">
                      {MORE_SUBMENU.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition group/item"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover/item:bg-blue-600 group-hover/item:text-white transition">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center gap-4">
              {isLoading ? (
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <UserProfileDropdown user={user} onLogout={handleLogout} />
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-5 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={handleMenuToggle}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={mobileMenuClasses}>
          <div className="overflow-y-auto max-h-[calc(100vh-64px)]">
            <div className="px-4 py-6">
              {/* Main Navigation Links */}
              <nav className="grid gap-2" aria-label="Mobile navigation">
                {MAIN_LINKS.map((link) => (
                  <MobileNavLink
                    key={link.to}
                    to={link.to}
                    icon={link.icon}
                    label={link.label}
                    isActive={isActivePath(link.to)}
                    onClick={handleMenuClose}
                  />
                ))}
              </nav>

              {/* Resources Section */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-3">
                  Resources
                </p>
                <nav className="grid gap-1">
                  {MORE_SUBMENU.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={handleMenuClose}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50"
                    >
                      <div className="text-blue-600">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-gray-800">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Auth Section */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                {user ? (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {getInitials(user.fullname)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.fullname}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/profile"
                        onClick={handleMenuClose}
                        className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 py-3 bg-red-50 rounded-xl text-sm font-bold text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <Link
                      to="/login"
                      onClick={handleMenuClose}
                      className="w-full py-4 text-center font-bold text-gray-700 border border-gray-200 rounded-2xl"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={handleMenuClose}
                      className="w-full py-4 text-center font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-100"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;