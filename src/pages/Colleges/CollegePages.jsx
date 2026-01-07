import React, { useEffect, useState } from "react";
import CollegeCard from "../../components/collegecard/CollegeCard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Pagination from "../../components/Pagination/pagination";
import { Search, X, RefreshCw } from "lucide-react";

const PAGE_SIZE = 12;
const API_BASE = "http://185.177.116.173:8080/api/v1/colleges";

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
  const fetchColleges = async ({ query = "", uiPage = 1 }) => {
    try {
      setLoading(true);
      setError(null);

      const apiPage = uiPage - 1; // Convert to 0-based for API

      const url = query.trim()
        ? `${API_BASE}/search?name=${encodeURIComponent(query.trim())}&page=${apiPage}&size=${PAGE_SIZE}`
        : `${API_BASE}?page=${apiPage}&size=${PAGE_SIZE}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch colleges");

      const json = await res.json();
      const data = json?.data || {};

      setColleges(data.content || []);
      setTotalPages(data.page?.totalPages || data.totalPages || 1);
      setTotalElements(data.page?.totalElements || data.totalElements || 0);
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
    fetchColleges({ uiPage: 1 });
  }, []);

  // Search handler
  const handleSearch = () => {
    fetchColleges({ query: searchTerm.trim(), uiPage: 1 });
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    fetchColleges({ query: "", uiPage: 1 });
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    fetchColleges({ query: searchTerm.trim(), uiPage: newPage });
  };

  // Calculate display range
  const startItem = totalElements > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endItem = Math.min(page * PAGE_SIZE, totalElements);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Colleges in Nepal
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Discover and explore educational institutions across Nepal
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-10 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by college name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-28 py-4 text-lg bg-white border-2 border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-24 p-1 text-slate-400 hover:text-slate-600 transition"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}
              <button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
              >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : "Search"}
              </button>
            </div>

            {searchTerm && !loading && colleges.length > 0 && (
              <p className="mt-3 text-sm text-slate-500">
                Showing results for: <span className="font-semibold text-slate-700">"{searchTerm}"</span>
              </p>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading colleges...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-red-100">
              <p className="text-red-600 text-lg font-medium">{error}</p>
              <button
                onClick={() => fetchColleges({ query: searchTerm, uiPage: 1 })}
                className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                Try Again
              </button>
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-lg font-semibold text-slate-700">
                {searchTerm ? `No colleges found for "${searchTerm}"` : "No colleges available"}
              </p>
              <p className="text-slate-500 mt-1">Try a different search term</p>
            </div>
          ) : (
            <>
              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {colleges.map((college) => (
                  <CollegeCard key={college.collegeId} college={college} />
                ))}
              </div>

              {/* Results Count */}
              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Showing <span className="text-slate-800 font-bold">{startItem}–{endItem}</span> of{" "}
                  <span className="text-slate-800 font-bold">{totalElements}</span> colleges
                </p>
              </div>

              {/* Pagination */}
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
