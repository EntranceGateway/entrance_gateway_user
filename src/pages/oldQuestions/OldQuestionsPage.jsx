import { useEffect, useState, useMemo } from "react";
import { searchOldQuestions } from "../../http/oldQuestions";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { DEFAULT_PAGE_SIZE } from "../../constants/pagination";

// Import modular components
import {
  OldQuestionsHeader,
  OldQuestionsFilters,
  OldQuestionsTable,
  OldQuestionsPagination,
} from "./components";

export default function OldQuestionsPage() {
  /* =======================
     UI STATE
  ======================= */
  const [loading, setLoading] = useState(false);

  /* =======================
     DATA STATE
  ======================= */
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  /* =======================
     FILTER STATE
  ======================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedAffiliation, setSelectedAffiliation] = useState("");

  /* =======================
     FETCH QUESTIONS
  ======================= */
  useEffect(() => {
    fetchQuestions();
  }, [currentPage, selectedCourse, selectedYear, selectedAffiliation]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      const searchParams = {};
      if (selectedCourse) searchParams.courseName = selectedCourse;
      if (selectedYear) searchParams.year = selectedYear;
      if (selectedAffiliation) searchParams.affiliation = selectedAffiliation;

      const response = await searchOldQuestions(
        searchParams,
        currentPage,
        DEFAULT_PAGE_SIZE
      );

      setQuestions(response.items || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setQuestions([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     CLIENT-SIDE SEARCH
  ======================= */
  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;

    const query = searchQuery.toLowerCase();
    return questions.filter(
      (question) =>
        question.setName?.toLowerCase().includes(query) ||
        question.subject?.toLowerCase().includes(query) ||
        question.courseName?.toLowerCase().includes(query)
    );
  }, [questions, searchQuery]);

  /* =======================
     HANDLERS
  ======================= */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage - 1); // Convert to 0-based for API
  };

  const handleFilterChange = (filterType, value) => {
    // Reset to first page when filters change
    setCurrentPage(0);

    switch (filterType) {
      case "course":
        setSelectedCourse(value);
        break;
      case "year":
        setSelectedYear(value);
        break;
      case "affiliation":
        setSelectedAffiliation(value);
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCourse("");
    setSelectedYear("");
    setSelectedAffiliation("");
    setCurrentPage(0);
  };

  /* =======================
     UI
  ======================= */
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Header */}
          <OldQuestionsHeader totalResults={totalElements} />

          {/* Filters */}
          <OldQuestionsFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCourse={selectedCourse}
            onCourseChange={(value) => handleFilterChange("course", value)}
            selectedYear={selectedYear}
            onYearChange={(value) => handleFilterChange("year", value)}
            selectedAffiliation={selectedAffiliation}
            onAffiliationChange={(value) => handleFilterChange("affiliation", value)}
            onReset={handleReset}
          />

          {/* Table */}
          <OldQuestionsTable questions={filteredQuestions} loading={loading} />

          {/* Pagination */}
          {!loading && filteredQuestions.length > 0 && (
            <div className="mt-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <OldQuestionsPagination
                  currentPage={currentPage + 1} // Convert to 1-based for display
                  totalPages={totalPages}
                  totalItems={totalElements}
                  pageSize={DEFAULT_PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
