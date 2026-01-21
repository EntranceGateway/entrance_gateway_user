import React, { useEffect, useState } from "react";
import CollegeCard from "../../components/collegecard/CollegeCard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Pagination from "../../components/Pagination/pagination";
import { getColleges, searchColleges } from "../../http/colleges";
import { 
  PageHeader, 
  LoadingSpinner, 
  ErrorState, 
  SearchBar, 
  ItemGrid 
} from "../../components/common";

const PAGE_SIZE = 12;

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state (1-based)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Unified fetch function for search & pagination
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

  // Initial load
  useEffect(() => {
    fetchCollegesData({ uiPage: 1 });
  }, []);

  // Search handler
  const handleSearch = () => {
    fetchCollegesData({ query: searchTerm.trim(), uiPage: 1 });
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    fetchCollegesData({ query: "", uiPage: 1 });
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    fetchCollegesData({ query: searchTerm.trim(), uiPage: newPage });
  };

  // Calculate display range
  const startItem = totalElements > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endItem = Math.min(page * PAGE_SIZE, totalElements);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Colleges in Nepal"
            subtitle="Discover and explore educational institutions across Nepal"
          >
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              onClear={clearSearch}
              placeholder="Search by college name..."
              isLoading={loading}
              className="max-w-2xl"
            />
            {searchTerm && !loading && colleges.length > 0 && (
              <p className="mt-3 text-sm text-slate-500">
                Showing results for: <span className="font-semibold text-slate-700">"{searchTerm}"</span>
              </p>
            )}
          </PageHeader>

          {/* Content */}
          {loading ? (
            <LoadingSpinner message="Loading colleges..." />
          ) : error ? (
            <ErrorState
              title="Failed to load colleges"
              message={error}
              onRetry={() => fetchColleges({ query: searchTerm, uiPage: 1 })}
            />
          ) : colleges.length === 0 ? (
            <ErrorState
              variant="not-found"
              title={searchTerm ? `No colleges found for "${searchTerm}"` : "No colleges available"}
              message="Try a different search term"
            />
          ) : (
            <>
              <ItemGrid
                items={colleges}
                columns={3}
                keyExtractor={(college) => college.collegeId}
                renderItem={(college) => <CollegeCard college={college} />}
              />

              {/* Results Count */}
              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Showing <span className="text-slate-800 font-bold">{startItem}–{endItem}</span> of{" "}
                  <span className="text-slate-800 font-bold">{totalElements}</span> colleges
                </p>
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={loading}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CollegesPage;
