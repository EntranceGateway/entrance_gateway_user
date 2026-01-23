import { useEffect, useState, useMemo } from "react";
import { getNotesByFilters } from "../../http/notes";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { DEFAULT_PAGE_SIZE } from "../../constants/pagination";
import { UNIVERSITIES } from "../../constants/universities";

// Import modular components
import {
  NotesPageHeader,
  NotesFilterBar,
  NoteGridCard,
  NotesPagination,
} from "./components";

export default function NotesPage() {
  /* =======================
     UI STATE
  ======================= */
  const [loading, setLoading] = useState(false);

  /* =======================
     DATA STATE
  ======================= */
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  /* =======================
     FILTER STATE
  ======================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAffiliation, setSelectedAffiliation] = useState("");

  // Available courses (can be fetched from API)
  const availableCourses = ["CSIT", "MBBS", "BBA", "BDS", "BCA"];
  
  // Available affiliations from constants
  const availableAffiliations = UNIVERSITIES.map(uni => ({
    value: uni.value,
    label: uni.label
  }));

  /* =======================
     FETCH NOTES BASED ON FILTERS
  ======================= */
  useEffect(() => {
    fetchNotes();
  }, [currentPage, selectedCourse, selectedSemester, selectedAffiliation]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await getNotesByFilters({
        courseName: selectedCourse,
        semester: selectedSemester,
        affiliation: selectedAffiliation,
        page: currentPage,
        size: DEFAULT_PAGE_SIZE,
        sortBy: "noteName",
        sortDir: "asc"
      });
      
      setNotes(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch notes", err);
      // If 401 error (authentication required), show empty state
      // User can still browse the page and will be prompted to login when clicking a note
      setNotes([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     SEARCH (CLIENT-SIDE)
  ======================= */
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.noteName?.toLowerCase().includes(query) ||
        note.subject?.toLowerCase().includes(query) ||
        note.subjectCode?.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

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
      case 'course':
        setSelectedCourse(value);
        break;
      case 'semester':
        setSelectedSemester(value);
        break;
      case 'affiliation':
        setSelectedAffiliation(value);
        break;
      default:
        break;
    }
  };

  const handleFilter = () => {
    // Reset to first page and refetch
    setCurrentPage(0);
    fetchNotes();
  };

  /* =======================
     UI
  ======================= */
  return (
    <DashboardLayout>
      <div className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col transition-colors duration-200 antialiased">
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <NotesPageHeader />

            {/* Filter Bar */}
            <NotesFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCourse={selectedCourse}
              onCourseChange={(value) => handleFilterChange('course', value)}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              selectedSemester={selectedSemester}
              onSemesterChange={(value) => handleFilterChange('semester', value)}
              selectedAffiliation={selectedAffiliation}
              onAffiliationChange={(value) => handleFilterChange('affiliation', value)}
              onFilter={handleFilter}
              courses={availableCourses}
              affiliations={availableAffiliations}
            />

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-500 font-medium">Loading notes...</p>
                </div>
              </div>
            ) : filteredNotes.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300">
                    {searchQuery ? "search_off" : "lock"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  {searchQuery ? "No notes found" : "Login Required"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "Please login to view and access study notes"}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-brand-blue hover:text-brand-navy font-medium"
                  >
                    Clear search
                  </button>
                ) : (
                  <button
                    onClick={() => window.location.href = "/login"}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold hover:bg-yellow-500 text-brand-navy font-semibold rounded-lg transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined">login</span>
                    Login to Continue
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {filteredNotes.map((note) => (
                    <NoteGridCard key={note.noteId} note={note} />
                  ))}
                </div>

                {/* Pagination */}
                <NotesPagination
                  currentPage={currentPage + 1} // Convert to 1-based for display
                  totalPages={totalPages}
                  totalItems={totalElements}
                  itemsPerPage={DEFAULT_PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}