import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getTrainings } from "../../http/trainingApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TrainingListCard from "../../components/Training/TrainingListCard";
import SkeletonCard from "../../components/Training/SkeletonCard";

function TrainingsPage() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    type: "any",
    status: "open"
  });
  const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchTrainings();
  }, [currentPage, filters]);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const data = await getTrainings(currentPage, pageSize, "desc");
      setTrainings(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Error fetching trainings:", error);
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page neighbors, and last page
      if (currentPage <= 2) {
        // Near the start
        for (let i = 0; i < 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        // Near the end
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 3; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(0);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-brand-navy text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 bg-white/20 h-64 w-64 rounded-full blur-3xl"></div>
            <div className="absolute left-0 bottom-0 -ml-16 -mb-16 bg-brand-blue h-64 w-64 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
            <div className="flex items-center gap-2 mb-4 text-brand-gold font-medium text-sm tracking-wide uppercase">
              <span className="material-icons-round text-lg">verified</span>
              <span>Entrance Preparation</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 font-display">
              Expert-Led Training Programs
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed">
              Secure your future with Nepal's top-rated entrance preparation courses. Browse our directory of specialized coaching for Medical, Engineering, and IT exams.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-20">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 mb-1">CATEGORY</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="block w-full rounded-lg border-gray-300 bg-gray-50 text-sm focus:border-brand-blue focus:ring-brand-blue py-2.5"
                >
                  <option value="all">All Categories</option>
                  <option value="medical">Medical (CEE)</option>
                  <option value="engineering">Engineering (IOE)</option>
                  <option value="it">IT & Computer Science</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 mb-1">TRAINING TYPE</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="block w-full rounded-lg border-gray-300 bg-gray-50 text-sm focus:border-brand-blue focus:ring-brand-blue py-2.5"
                >
                  <option value="any">Any Type</option>
                  <option value="hybrid">Hybrid (Physical + Online)</option>
                  <option value="online">Online Only</option>
                  <option value="physical">Physical Only</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 mb-1">STATUS</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="block w-full rounded-lg border-gray-300 bg-gray-50 text-sm focus:border-brand-blue focus:ring-brand-blue py-2.5"
                >
                  <option value="open">Registration Open</option>
                  <option value="waitlist">Waitlist Only</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-brand-navy font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm h-[42px]">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mb-4 text-sm text-gray-600">
              Showing <span className="font-semibold">{trainings.length}</span> of <span className="font-semibold">{totalElements}</span> trainings
            </div>
          )}

          {/* Training List */}
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : trainings.length > 0 ? (
              trainings.map((training) => (
                <TrainingListCard key={training.trainingId} training={training} />
              ))
            ) : (
              <div className="text-center py-16 text-gray-500">
                <p className="text-xl">No trainings available at the moment.</p>
                <p className="mt-2">Check back soon or adjust your filters!</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && trainings.length > 0 && totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <nav aria-label="Pagination" className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-brand-navy text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      aria-label={`Page ${page + 1}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page + 1}
                    </button>
                  )
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TrainingsPage;