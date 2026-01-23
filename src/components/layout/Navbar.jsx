import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useUserAuth from "../../hooks/useUserAuth";
import { getInitials } from "../../utils/formatters";

// Primary navigation - shown directly in navbar
const PRIMARY_LINKS = [
  { name: "Home", path: "/" },
  { name: "Syllabus", path: "/syllabus" },
  { name: "Notes", path: "/notes" },
  { name: "Old Questions", path: "/old-questions" },
  { name: "Colleges", path: "/colleges" },
  { name: "Courses", path: "/courses" },
  { name: "Blogs", path: "/blogs" },
  { name: "Trainings", path: "/training" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav aria-label="Global" className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex md:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="sr-only">EntranceGateway</span>
            <div className="bg-accent/10 p-1.5 sm:p-2 rounded-lg">
              <span className="material-symbols-outlined text-accent text-xl sm:text-2xl">school</span>
            </div>
            <span className="font-display font-bold text-lg sm:text-xl text-accent tracking-tight">
              EntranceGateway
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex lg:gap-x-8 gap-x-4 xl:gap-x-10">
          {PRIMARY_LINKS.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-semibold transition-colors relative group py-1 ${
                location.pathname === item.path
                  ? "text-accent"
                  : "text-gray-700 hover:text-accent"
              }`}
            >
              {item.name}
              {/* Animated underline */}
              <span className={`absolute left-0 -bottom-1 h-0.5 bg-accent transition-all duration-300 ${
                location.pathname === item.path 
                  ? "w-full" 
                  : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
        </div>

        {/* Desktop auth section */}
        <div className="hidden md:flex md:flex-1 md:justify-end md:items-center md:gap-x-3 lg:gap-x-4">
          {!isLoading && (
            user ? (
              <div
                ref={profileRef}
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button className="flex items-center gap-2 lg:gap-2.5 px-2 lg:px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                  <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {getInitials(user.fullname)}
                  </div>
                  <div className="text-left max-w-[100px] lg:max-w-[120px] hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.fullname || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.interested || "Student"}</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 text-lg hidden lg:inline">
                    {profileOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>

                <div className={`absolute right-0 top-full pt-2 transition-all duration-200 ${profileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"}`}>
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[260px]">
                    {/* User Info Header */}
                    <div className="px-5 py-4 bg-gradient-to-r from-accent/5 to-primary/5 border-b border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {getInitials(user.fullname)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.fullname}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 truncate">
                            <span className="material-symbols-outlined text-xs">mail</span>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {user.isVerified && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          <span className="font-medium">Verified Account</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <Link 
                        to="/" 
                        onClick={() => setProfileOpen(false)} 
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-accent/5 hover:text-accent transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-base text-gray-600 group-hover:text-accent">dashboard</span>
                        </div>
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      
                      <Link 
                        to="/profile" 
                        onClick={() => setProfileOpen(false)} 
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-accent/5 hover:text-accent transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-base text-gray-600 group-hover:text-accent">person</span>
                        </div>
                        <span className="font-medium">My Profile</span>
                      </Link>
                      
                      <div className="h-px bg-gray-100 mx-3 my-2" />
                      
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-base text-red-600">logout</span>
                        </div>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-accent transition-colors whitespace-nowrap">
                  Log in <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link to="/signup" className="text-sm font-semibold text-gray-700 hover:text-accent transition-colors whitespace-nowrap">
                  Sign up <span aria-hidden="true">&rarr;</span>
                </Link>
              </>
            )
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop with animation */}
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 animate-fadeIn" 
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Slide-out menu with animation */}
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 animate-slideInRight">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">EntranceGateway</span>
                <div className="bg-accent/10 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-accent text-2xl">school</span>
                </div>
                <span className="font-display font-bold text-xl text-accent tracking-tight">
                  EntranceGateway
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-200">
                {/* Navigation links */}
                <div className="space-y-2 py-6">
                  {PRIMARY_LINKS.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 transition-colors ${
                        location.pathname === item.path
                          ? "bg-accent/10 text-accent"
                          : "text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                {/* Auth section */}
                <div className="py-6">
                  {!isLoading && (
                    user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg">
                          <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                            {getInitials(user.fullname)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{user.fullname}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                        <Link 
                          to="/profile" 
                          className="-mx-3 flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">person</span>
                          My Profile
                        </Link>
                        <button 
                          onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                          className="-mx-3 w-full flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">logout</span>
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link
                          to="/login"
                          className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-center text-gray-900 hover:bg-gray-50 border border-gray-200 transition-colors"
                        >
                          Log in
                        </Link>
                        <Link
                          to="/signup"
                          className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-center text-white bg-accent hover:bg-secondary transition-colors shadow-md"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;