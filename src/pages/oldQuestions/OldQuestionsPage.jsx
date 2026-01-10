/**
 * Old Questions Page
 * Professional UI for browsing and viewing old exam question papers
 * 
 * Features:
 * - Filter by course, semester, affiliation, and year
 * - Grid view of question papers with professional cards
 * - PDF viewing functionality
 * - Pagination support
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileQuestion,
  Calendar,
  GraduationCap,
  BookOpen,
  Eye,
  Download,
  Filter,
  FileText,
  Library,
  Sparkles,
  ChevronDown,X
} from "lucide-react";
import UniversalFilter from "../../components/FilterSidebar/FilterSidebar";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Pagination from "../../components/Pagination/pagination";
import { filterOldQuestions } from "../../http/oldQuestions";
import { DEFAULT_PAGE_SIZE } from "../../constants/pagination";

/* ============================================
   QUESTION CARD COMPONENT
============================================ */
function QuestionCard({ question, index, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  // Gradient based on year for visual variety
  const getYearGradient = (year) => {
    const yearNum = parseInt(year) || 2024;
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-orange-500 to-red-600",
      "from-emerald-500 to-teal-600",
      "from-cyan-500 to-blue-600",
    ];
    return gradients[yearNum % gradients.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative bg-white rounded-xl sm:rounded-2xl border border-slate-200/80
                 hover:border-orange-300/50 transition-all duration-500
                 hover:shadow-[0_20px_50px_rgba(255,115,0,0.12)]
                 overflow-hidden h-full flex flex-col cursor-pointer
                 active:scale-[0.98] sm:active:scale-100"
    >
      {/* Top Accent Bar */}
      <div className={`h-1 sm:h-1.5 bg-linear-to-r ${getYearGradient(question.year)}`} />

      {/* Decorative Background Circle */}
      <div
        className="absolute -top-12 -right-12 w-24 sm:w-32 h-24 sm:h-32 rounded-full opacity-30
                   bg-linear-to-br from-orange-100 to-transparent
                   group-hover:opacity-50 transition-opacity duration-500"
      />

      <div className="p-4 sm:p-5 flex flex-col h-full relative">
        {/* Header: Icon + Year Badge */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div
            className={`p-2.5 sm:p-3 bg-linear-to-br ${getYearGradient(question.year)}
                        rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 
                        group-hover:rotate-3 transition-all duration-300`}
          >
            <FileQuestion className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          <div className="flex items-center gap-2">
            {/* Year Badge */}
            <span
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 
                         bg-linear-to-r from-orange-100 to-orange-50
                         rounded-full text-[10px] sm:text-xs font-bold 
                         text-orange-700 border border-orange-200
                         shadow-sm"
            >
              <Calendar size={10} className="sm:w-3 sm:h-3 text-orange-500" />
              {question.displayYear}
            </span>
          </div>
        </div>

        {/* Subject Title */}
        <h3
          className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 line-clamp-2
                     group-hover:text-orange-600 transition-colors duration-300"
        >
          {question.subject}
        </h3>

        {/* Set Name */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <FileText size={12} className="sm:w-3.5 sm:h-3.5 text-orange-500" />
          <span className="text-xs sm:text-sm font-semibold text-orange-600">
            {question.setName}
          </span>
        </div>

        {/* Description - Hide on very small screens */}
        {question.description && (
          <p className="hidden sm:block text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {question.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="mt-auto space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-slate-100">
          {/* Course Name */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600">
            <div className="p-0.5 sm:p-1 bg-slate-100 rounded-md">
              <GraduationCap size={10} className="sm:w-3 sm:h-3 text-slate-500" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium truncate">
              {question.courseName || "General"}
            </span>
          </div>

          {/* Affiliation */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600">
            <div className="p-0.5 sm:p-1 bg-slate-100 rounded-md">
              <Library size={10} className="sm:w-3 sm:h-3 text-slate-500" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium truncate">
              {question.affiliation?.replace(/_/g, " ") || "University"}
            </span>
          </div>
        </div>

        {/* Click to View Hint */}
        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4
                        bg-slate-50 group-hover:bg-orange-50 
                        border border-slate-200 group-hover:border-orange-200
                        rounded-lg sm:rounded-xl transition-all duration-300">
          <Eye size={14} className="sm:w-4 sm:h-4 text-slate-500 group-hover:text-orange-500" />
          <span className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-orange-600">
            Click to view
          </span>
        </div>
      </div>

      {/* Hover Effect Glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl
                       ring-2 ring-orange-400/30"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================================
   YEAR SELECT COMPONENT (Dropdown Input)
============================================ */
function YearSelect({ selectedYear, onYearChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="mb-6">
      <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
        <Calendar size={14} className="text-orange-500" />
        Select Year
      </label>
      <div className="relative mt-2">
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full appearance-none px-4 py-3 pr-10
                     bg-white border border-slate-200 rounded-xl
                     text-slate-800 font-medium text-sm
                     focus:border-orange-500 focus:ring-2 focus:ring-orange-100
                     transition-all duration-200 cursor-pointer
                     hover:border-orange-300 shadow-sm"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown size={18} className="text-slate-400" />
        </div>
      </div>

      {/* Selected Year Display */}
      {selectedYear && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center justify-between p-2.5 
                     bg-orange-50 rounded-lg border border-orange-200"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center">
              <Calendar size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-orange-600 font-medium leading-tight">Year</p>
              <p className="text-sm font-bold text-orange-700">{selectedYear}</p>
            </div>
          </div>
          <button
            onClick={() => onYearChange("")}
            className="p-1 hover:bg-orange-200 rounded-md transition-colors"
            aria-label="Clear year filter"
          >
            <X size={14} className="text-orange-600" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ============================================
   NO COURSE SELECTED STATE
============================================ */
function NoCourseSelected() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 sm:py-16 lg:py-20 px-4"
    >
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-linear-to-br
                   from-blue-100 to-indigo-100 flex items-center justify-center
                   shadow-xl shadow-blue-100 border border-blue-200"
      >
        <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-blue-500" />
      </div>
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
        Select a Course to Begin
      </h3>
      <p className="text-sm sm:text-base text-slate-500 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 leading-relaxed">
        Please select a course from the filters to view 
        available old question papers. You can also filter by semester, 
        year, and affiliation.
      </p>
      <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-blue-600 font-medium
                      bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
        <Filter size={14} className="sm:w-4 sm:h-4" />
        <span>Use the filter panel to select your course</span>
      </div>
    </motion.div>
  );
}

/* ============================================
   EMPTY STATE COMPONENT
============================================ */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div
        className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-linear-to-br
                   from-orange-100 to-orange-50 flex items-center justify-center
                   shadow-lg shadow-orange-100"
      >
        <FileQuestion className="w-12 h-12 text-orange-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        No Questions Found
      </h3>
      <p className="text-slate-500 max-w-md mx-auto">
        We couldn't find any old question papers matching your filters.
        Try adjusting your search criteria.
      </p>
    </motion.div>
  );
}

/* ============================================
   LOADING SKELETON COMPONENT
============================================ */
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
        >
          <div className="h-1.5 bg-slate-200 animate-pulse" />
          <div className="p-5 space-y-4">
            <div className="flex justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-200 animate-pulse" />
              <div className="w-20 h-7 rounded-full bg-slate-200 animate-pulse" />
            </div>
            <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="flex-1 h-10 bg-slate-200 rounded-xl animate-pulse" />
              <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================
   MAIN PAGE COMPONENT
============================================ */
export default function OldQuestionsPage() {
  const navigate = useNavigate();

  /* =======================
     UI STATE
  ======================= */
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  /* =======================
     DATA STATE
  ======================= */
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /* =======================
     FILTER STATE
  ======================= */
  const [activeFilters, setActiveFilters] = useState({
    courseNames: [],
    semesters: [],
    affiliations: [],
  });
  const [selectedYear, setSelectedYear] = useState("");

  /* =======================
     HANDLERS
  ======================= */
  const handleCardClick = (question) => {
    // Navigate to detail page with question data
    navigate(`/old-questions/${question.id}`, { state: { question } });
  };

  /* =======================
     FETCH QUESTIONS
  ======================= */
  useEffect(() => {
    // Only fetch if course is selected (courseName is required)
    if (activeFilters.courseNames.length > 0) {
      fetchQuestions();
    } else {
      // Clear results if no course selected
      setQuestions([]);
      setTotalElements(0);
      setTotalPages(0);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, selectedYear, currentPage]);

  const fetchQuestions = async () => {
    // courseName is required for filter endpoint
    if (!activeFilters.courseNames[0]) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const filterParams = {
        courseName: activeFilters.courseNames[0],
        semester: activeFilters.semesters[0] || undefined,
        affiliation: activeFilters.affiliations[0] || undefined,
        year: selectedYear || undefined,
      };

      // Clean undefined values
      Object.keys(filterParams).forEach(
        (key) => filterParams[key] === undefined && delete filterParams[key]
      );

      const result = await filterOldQuestions(
        filterParams,
        currentPage - 1, // API is 0-indexed
        DEFAULT_PAGE_SIZE
      );

      setQuestions(result.items);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setQuestions([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, selectedYear]);

  /* =======================
     UI
  ======================= */
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div
                  className="p-2.5 sm:p-3 bg-linear-to-br from-orange-500 to-orange-600
                             rounded-xl sm:rounded-2xl shadow-lg shadow-orange-200 shrink-0"
                >
                  <FileQuestion className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                    Old Questions
                  </h1>
                  <p className="text-slate-500 flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-xs sm:text-sm">
                    <Sparkles size={12} className="text-orange-500 shrink-0" />
                    <span className="truncate">Practice with past exam papers</span>
                  </p>
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterVisible((v) => !v)}
                className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 
                           bg-orange-500 hover:bg-orange-600 text-white rounded-xl
                           shadow-lg shadow-orange-200 transition-all shrink-0"
              >
                {isFilterVisible ? <X size={18} /> : <Filter size={18} />}
                <span className="font-medium text-sm hidden sm:inline">Filters</span>
              </button>
            </div>
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
            {/* Mobile Overlay - Outside of aside for proper layering */}
            {isFilterVisible && (
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsFilterVisible(false)}
              />
            )}

            {/* Filter Sidebar */}
            <aside
              className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[320px] bg-white shadow-2xl
                          transform transition-transform duration-300 ease-in-out
                          lg:relative lg:inset-auto lg:translate-x-0 lg:shadow-none lg:bg-transparent
                          lg:w-auto lg:max-w-none lg:z-auto
                          ${isFilterVisible ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
              {/* Filter Content */}
              <div
                className="bg-white lg:rounded-2xl lg:border lg:border-slate-200
                           lg:shadow-lg h-full lg:h-fit lg:sticky lg:top-8 
                           lg:max-h-[calc(100vh-4rem)] overflow-y-auto"
              >
                <div className="p-4 sm:p-5 lg:p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Filter size={16} className="text-orange-500" />
                      Filters
                    </h2>
                    <button
                      onClick={() => setIsFilterVisible(false)}
                      className="lg:hidden p-2 rounded-lg hover:bg-slate-100 -mr-1"
                    >
                      <X size={20} className="text-slate-500" />
                    </button>
                  </div>

                  {/* Year Filter */}
                  <YearSelect
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                  />

                  {/* Universal Filter */}
                  <UniversalFilter
                    onFilterChange={setActiveFilters}
                    initialFilters={activeFilters}
                    showCourseName={true}
                    showSemester={true}
                    showAffiliation={true}
                  />

                  {/* Clear All Button */}
                  {(activeFilters.courseNames.length > 0 ||
                    activeFilters.semesters.length > 0 ||
                    activeFilters.affiliations.length > 0 ||
                    selectedYear) && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        setActiveFilters({
                          courseNames: [],
                          semesters: [],
                          affiliations: [],
                        });
                        setSelectedYear("");
                      }}
                      className="mt-6 w-full py-2.5 text-sm font-semibold
                                 text-red-600 hover:text-white border border-red-200
                                 hover:border-red-500 hover:bg-red-500
                                 rounded-xl transition-all duration-300"
                    >
                      Clear All Filters
                    </motion.button>
                  )}

                  {/* Mobile Apply Button */}
                  <button
                    onClick={() => setIsFilterVisible(false)}
                    className="lg:hidden mt-4 w-full py-3 bg-orange-500 hover:bg-orange-600
                               text-white font-semibold rounded-xl transition-all
                               shadow-lg shadow-orange-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Questions Grid */}
            <main className="min-w-0">
              {/* Results Header - Only show when course is selected */}
              {activeFilters.courseNames.length > 0 && (
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 text-orange-700
                                 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold"
                    >
                      {loading ? "..." : totalElements}
                    </div>
                    <span className="text-slate-600 font-medium text-sm sm:text-base">
                      Question Papers Found
                    </span>
                  </div>

                  {/* Active Filter Pills */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {activeFilters.courseNames.map((course) => (
                      <span
                        key={course}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs
                                   font-semibold rounded-full flex items-center gap-1"
                      >
                        <GraduationCap size={10} className="sm:w-3 sm:h-3" />
                        {course}
                      </span>
                    ))}
                    {activeFilters.semesters.map((sem) => (
                      <span
                        key={sem}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs
                                   font-semibold rounded-full flex items-center gap-1"
                      >
                        <BookOpen size={10} className="sm:w-3 sm:h-3" />
                        Sem {sem}
                      </span>
                    ))}
                    {selectedYear && (
                      <span
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-100 text-purple-700 text-[10px] sm:text-xs
                                   font-semibold rounded-full flex items-center gap-1"
                      >
                        <Calendar size={10} className="sm:w-3 sm:h-3" />
                        {selectedYear}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              {activeFilters.courseNames.length === 0 ? (
                <NoCourseSelected />
              ) : loading ? (
                <LoadingSkeleton />
              ) : questions.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
                  >
                    {questions.map((question, index) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        index={index}
                        onClick={() => handleCardClick(question)}
                      />
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 sm:mt-8"
                    >
                      <Pagination
                        page={currentPage}
                        totalItems={totalElements}
                        pageSize={DEFAULT_PAGE_SIZE}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        isDisabled={loading}
                        showPageInfo={true}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
