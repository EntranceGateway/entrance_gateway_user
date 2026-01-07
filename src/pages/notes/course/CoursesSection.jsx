import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // ← Important: Use Link for navigation

const API_BASE = "http://185.177.116.173:8080/api/v1";

// Map backend enum keys to display names
const AFFILIATION_OPTIONS = [
  { value: "All", label: "All Universities" },
  { value: "TRIBHUVAN_UNIVERSITY", label: "Tribhuvan University" },
  { value: "KATHMANDU_UNIVERSITY", label: "Kathmandu University" },
  { value: "POKHARA_UNIVERSITY", label: "Pokhara University" },
  { value: "PURWANCHAL_UNIVERSITY", label: "Purbanchal University" },
  { value: "LUMBINI_UNIVERSITY", label: "Lumbini University" },
  { value: "MID_WESTERN_UNIVERSITY", label: "Mid Western University" },
  { value: "FAR_WESTERN_UNIVERSITY", label: "Far Western University" },
];

const DEFAULT_COURSE_IMAGE = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

export default function CoursesSection() {
  const [allCourses, setAllCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [affiliation, setAffiliation] = useState("TRIBHUVAN_UNIVERSITY"); // Default to Tribhuvan University
  const [loading, setLoading] = useState(true);

  // Fetch all courses once
  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/courses?sort=desc`);
        if (!res.ok) throw new Error("Failed to fetch courses");

        const json = await res.json();
        const data = json?.data?.content || [];

        setAllCourses(data);
        // Initial display: top 3 from Tribhuvan University (descending order)
        const tuCourses = data.filter((course) => course.affiliation === "TRIBHUVAN_UNIVERSITY");
        setDisplayedCourses(tuCourses.slice(0, 3));
      } catch (err) {
        console.error("Course fetch failed", err);
        setAllCourses([]);
        setDisplayedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  // Update displayed courses when filter changes
  useEffect(() => {
    let filtered = allCourses;

    if (affiliation !== "All") {
      filtered = allCourses.filter((course) => course.affiliation === affiliation);
    }

    // Always show max 3 courses
    setDisplayedCourses(filtered.slice(0, 3));
  }, [affiliation, allCourses]);

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
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
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
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight"
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

          {/* Filter Dropdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative min-w-[240px]"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>

            <select
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="block w-full pl-10 pr-10 py-3.5 text-base border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer appearance-none font-medium"
            >
              {AFFILIATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Courses Grid */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Skeleton Loaders
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[440px] flex flex-col"
                >
                  <div className="w-full h-56 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
                  <div className="h-7 bg-gray-200 rounded w-4/5 animate-pulse mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/5 animate-pulse mb-6"></div>
                  <div className="mt-auto space-y-3">
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
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-500 flex flex-col h-full"
                >
                  {/* Course Image */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={course.imageUrl || DEFAULT_COURSE_IMAGE}
                      alt={course.courseName}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {/* Affiliation Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-white/95 backdrop-blur-sm text-gray-800 shadow-md">
                        {AFFILIATION_OPTIONS.find(opt => opt.value === course.affiliation)?.label || course.affiliation}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-extrabold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {course.courseName}
                    </h3> 

                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {course.description || "A comprehensive program designed to equip you with industry-relevant skills and knowledge."}
                    </p>

                    {/* View Details Link */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link
                        to={`/courses/${course.courseId}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group"
                      >
                        View Details
                        <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // No Results
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  No courses available for the selected university at the moment.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}