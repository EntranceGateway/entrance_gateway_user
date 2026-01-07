import { useEffect, useState, useMemo } from "react";
import api from "../../http";
import NoteCard from "../../components/common/NoteCard/NoteCard";
import Pagination from "../../components/Pagination/pagination";
import { Menu, X } from "lucide-react";
import UniversalFilter from "../../components/FilterSidebar/FilterSidebar";
import DashboardLayout from "../../components/layout/DashboardLayout";

const PAGE_SIZE = 12;

export default function NotesPage() {
  /* =======================
     UI STATE
  ======================= */
  const [loading, setLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  /* =======================
     DATA STATE
  ======================= */
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================
     FILTER STATE (SINGLE SOURCE OF TRUTH)
  ======================= */
  const [activeFilters, setActiveFilters] = useState({
    courseNames: ["CSIT"],           // initial default
    semesters: ["1"],                // initial default
    affiliations: ["TRIBHUVAN_UNIVERSITY"], // initial default
  });

  /* =======================
     FETCH NOTES BASED ON FILTERS
  ======================= */
  useEffect(() => {
    fetchNotes();
    setCurrentPage(1); // Reset to first page when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  const fetchNotes = async () => {
    const { courseNames, semesters, affiliations } = activeFilters;

    // If any required filter is empty, show nothing
    if (!courseNames.length || !semesters.length || !affiliations.length) {
      setNotes([]);
      return;
    }

    try {
      setLoading(true);

      // Build query params dynamically for multiple values
      const params = new URLSearchParams();
      courseNames.forEach(name => params.append("courseName", name));
      semesters.forEach(sem => params.append("semester", sem));
      affiliations.forEach(aff => params.append("affiliation", aff));

      const res = await api.get("/api/v1/notes/getNotesBy/courseName/semester/affiliation", {
        params,
      });

      setNotes(res.data?.data?.content || []);
    } catch (err) {
      console.error("Failed to fetch notes", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = useMemo(() => Math.ceil(notes.length / PAGE_SIZE), [notes.length]);
  const paginated = useMemo(
    () => notes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [notes, currentPage]
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* =======================
     UI
  ======================= */
  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Notes</h1>
          <button
            onClick={() => setIsFilterVisible((v) => !v)}
            className="p-2 rounded-lg bg-white shadow-sm border border-slate-200"
          >
            {isFilterVisible ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Filter Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0 lg:shadow-md lg:rounded-xl lg:top-8 lg:h-fit
              ${isFilterVisible ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            {/* Mobile Overlay */}
            {isFilterVisible && (
              <div
                className="fixed inset-0 bg-black/50 lg:hidden"
                onClick={() => setIsFilterVisible(false)}
              />
            )}

            {/* Filter Content */}
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                <button
                  onClick={() => setIsFilterVisible(false)}
                  className="lg:hidden p-1 rounded hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <UniversalFilter
                onFilterChange={setActiveFilters}
                initialFilters={activeFilters}
                showCourseName={true}
                showSemester={true}
                showAffiliation={true}
              />

              {/* Clear Filters Button */}
              {(activeFilters.courseNames.length > 0 ||
                activeFilters.semesters.length > 0 ||
                activeFilters.affiliations.length > 0) && (
                <button
                  onClick={() =>
                    setActiveFilters({
                      courseNames: [],
                      semesters: [],
                      affiliations: [],
                    })
                  }
                  className="mt-6 w-full py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Notes Grid */}
          <main>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="hidden lg:block text-3xl font-bold text-slate-900">Notes</h1>
              <p className="text-sm text-slate-600">
                {loading
                  ? "Loading notes..."
                  : `${notes.length} note${notes.length !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600" />
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
                <p className="text-lg text-slate-500">
                  No notes found for the selected filters.
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Try adjusting your course, semester, or university filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-[0.3fr_0.8fr] xl:grid-cols-[0.4fr_0.2fr] gap-6">
                  {paginated.map((note) => (
                    <NoteCard key={note.noteId} note={note} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={loading}
                  showPageInfo={true}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}