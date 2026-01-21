import { useEffect, useState } from "react";
import { Loader2, AlertCircle, ChevronDown } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getColleges, searchColleges } from "../../http/colleges";
import {
  CollegeCard,
  CollegeFilters,
  CollegeListHeader,
  CollegePagination,
} from "./components";

const PAGE_SIZE = 12;

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-brand-navy mb-2">Failed to load colleges</h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-brand-blue text-white font-semibold rounded-lg hover:bg-secondary transition"
      >
        Try Again
      </button>
    </div>
  );
}

function EmptyState({ searchTerm, onReset }) {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-500">
        {searchTerm ? `No colleges found for "${searchTerm}"` : "No colleges found matching your filters."}
      </p>
      <button onClick={onReset} className="mt-4 text-brand-blue font-medium hover:underline">
        Clear filters
      </button>
    </div>
  );
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const fetchCollegesData = async ({ query = "", uiPage = 1 }) => {
    try {
      setLoading(true);
      setError(null);

      const result = query.trim()
        ? await searchColleges({ name: query.trim(), page: uiPage, size: PAGE_SIZE })
        : await getColleges({ page: uiPage, size: PAGE_SIZE });

      setColleges(result.items);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setPage(uiPage);
    } catch (e) {
      console.error("Fetch error:", e);
      setError(e.message || "Something went wrong");
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollegesData({ uiPage: 1 });
  }, []);

  const handleSearch = () => {
    fetchCollegesData({ query: searchTerm.trim(), uiPage: 1 });
  };

  const handlePageChange = (newPage) => {
    fetchCollegesData({ query: searchTerm.trim(), uiPage: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSelectedCategories(['all']);
    setSelectedLocations([]);
    setSearchTerm("");
    fetchCollegesData({ uiPage: 1 });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <CollegeListHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            isLoading={loading}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            <CollegeFilters
              selectedCategories={selectedCategories}
              selectedLocations={selectedLocations}
              onCategoryChange={setSelectedCategories}
              onLocationChange={setSelectedLocations}
              onReset={handleResetFilters}
            />

            <div className="flex-grow">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500 text-sm">
                  Showing <span className="font-bold text-gray-900">{totalElements}</span> colleges
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                      <option>Relevance</option>
                      <option>Popularity</option>
                      <option>Newest</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={() => fetchCollegesData({ query: searchTerm, uiPage: 1 })} />
              ) : colleges.length === 0 ? (
                <EmptyState searchTerm={searchTerm} onReset={handleResetFilters} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {colleges.map((college) => (
                    <CollegeCard key={college.collegeId} college={college} />
                  ))}
                </div>
              )}

              <CollegePagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
