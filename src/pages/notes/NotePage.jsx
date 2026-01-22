import { useEffect, useState, useMemo } from "react";
import { getNotesByFilters } from "../../http/notes";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { DEFAULT_PAGE_SIZE } from "../../constants/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================
     FILTER STATE
  ======================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAffiliation, setSelectedAffiliation] = useState(""); // Empty = all affiliations

  // Available courses (can be fetched from API)
  const availableCourses = ["CSIT", "MBBS", "BBA", "BDS", "BCA"];
  
  // Available affiliations
  const availableAffiliations = [
    { value: "TRIBHUVAN_UNIVERSITY", label: "Tribhuvan University" },
    { value: "KATHMANDU_UNIVERSITY", label: "Kathmandu University" },
    { value: "POKHARA_UNIVERSITY", label: "Pokhara University" },
    { value: "PURBANCHAL_UNIVERSITY", label: "Purbanchal University" },
  ];

  /* =======================
     BUILD ACTIVE FILTERS
  ======================= */
  const activeFilters = useMemo(() => ({
    courseNames: selectedCourse ? [selectedCourse] : [],
    semesters: selectedSemester ? [selectedSemester] : [],
    affiliations: selectedAffiliation ? [selectedAffiliation] : [],
  }), [selectedCourse, selectedSemester, selectedAffiliation]);

  /* =======================
     FETCH NOTES BASED ON FILTERS
  ======================= */
  useEffect(() => {
    fetchNotes();
    setCurrentPage(1); // Reset to first page when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { items } = await getNotesByFilters(activeFilters);
      setNotes(items);
    } catch (err) {
      console.error("Failed to fetch notes", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     SEARCH & PAGINATION
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

  const totalPages = useMemo(
    () => Math.ceil(filteredNotes.length / DEFAULT_PAGE_SIZE),
    [filteredNotes.length]
  );

  const paginatedNotes = useMemo(
    () =>
      filteredNotes.slice(
        (currentPage - 1) * DEFAULT_PAGE_SIZE,
        currentPage * DEFAULT_PAGE_SIZE
      ),
    [filteredNotes, currentPage]
  );

  /* =======================
     HANDLERS
  ======================= */
  const handleFilter = () => {
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
              onCourseChange={setSelectedCourse}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              selectedSemester={selectedSemester}
              onSemesterChange={setSelectedSemester}
              selectedAffiliation={selectedAffiliation}
              onAffiliationChange={setSelectedAffiliation}
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
                    description
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No notes found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "Try adjusting your filters to find notes"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-brand-blue hover:text-brand-navy font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {paginatedNotes.map((note) => (
                    <NoteGridCard key={note.noteId} note={note} />
                  ))}
                </div>

                {/* Pagination */}
                <NotesPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredNotes.length}
                  itemsPerPage={DEFAULT_PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}