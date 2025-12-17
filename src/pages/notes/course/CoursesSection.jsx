import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://185.177.116.173:8080/api/v1";

export default function CoursesSection() {
  const [allCourses, setAllCourses] = useState([]); // Store ALL data here
  const [displayedCourses, setDisplayedCourses] = useState([]); // Store FILTERED data here
  const [affiliation, setAffiliation] = useState("All");
  const [loading, setLoading] = useState(true);

  // 1. Fetch ALL courses only once on mount
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // 2. Whenever 'affiliation' or 'allCourses' changes, update the displayed list
  useEffect(() => {
    if (affiliation === "All") {
      setDisplayedCourses(allCourses.slice(0, 6)); // Show top 6 from all
    } else {
      // Filter locally in the browser
      const filtered = allCourses.filter(
        (course) => course.affiliation === affiliation
      );
      setDisplayedCourses(filtered.slice(0, 6));
    }
  }, [affiliation, allCourses]);

  const fetchAllCourses = async () => {
    setLoading(true);
    try {
      // Always fetch the main list
      const res = await fetch(`${API_BASE}/courses`);
      const json = await res.json();
      
      const data = json?.data?.content || [];
      setAllCourses(data);
      setDisplayedCourses(data.slice(0, 6)); // Initial state
    } catch (err) {
      console.error("Course fetch failed", err);
      setAllCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-gray-50 py-20 lg:py-28 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-3"
            >
              Top Courses
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight"
            >
              Explore Educational <span className="text-orange-600">Opportunities</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gray-600 text-lg"
            >
              Discover handpicked courses from Nepal's leading universities tailored for your career growth.
            </motion.p>
          </div>

          {/* Styled Filter Dropdown */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative min-w-[200px]"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            {/* MAKE SURE VALUES MATCH YOUR API DATA EXACTLY */}
            <select
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 text-base border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer appearance-none"
            >
              <option value="All">All Affiliations</option>
              <option value="Tribhuvan University">Tribhuvan University</option>
              <option value="Kathmandu University">Kathmandu University</option>
              <option value="Pokhara University">Pokhara University</option>
              <option value="Purbanchal University">Purbanchal University</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </motion.div>
        </div>

        {/* Content Grid */}
        <motion.div 
          layout // Enables smooth layout transitions when filtering
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Skeleton Loader
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-[420px] flex flex-col"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-6"></div>
                  <div className="mt-auto space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  </div>
                </motion.div>
              ))
            ) : displayedCourses.length > 0 ? (
              displayedCourses.map((course) => (
                <motion.div
                  layout
                  key={course.courseId}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={course.imageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                      alt={course.courseName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
                        {course.affiliation || "University"}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {course.courseName}
                    </h3>

                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      <span className="line-clamp-1">{course.collegeName || "Partner College"}</span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {course.description || "Explore this comprehensive course designed to provide in-depth knowledge and practical skills for your future career."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <a
                        href={`/courses/${course.courseId}`}
                        className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors flex items-center gap-1"
                      >
                        View Details
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty State
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full py-12 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
                <p className="text-gray-500 mt-1">
                  We couldn't find any courses for "{affiliation}".
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
      
      </div>
    </section>
  );
}