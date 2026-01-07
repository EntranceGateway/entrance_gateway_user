// src/pages/CollegesPage.jsx
import React, { useState, useEffect } from 'react';
import CollegeCard from '../../components/collegecard/CollegeCard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Pagination from '../../components/Pagination/pagination';

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const PAGE_SIZE = 12;
  const API_BASE = 'http://185.177.116.173:8080/api/v1/colleges';

  const fetchColleges = async (query = '', pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      let url;
      if (query.trim()) {
        url = `http://185.177.116.173:8080/api/v1/colleges/search?name=${encodeURIComponent(query.trim())}&page=${pageNum - 1}&size=${PAGE_SIZE}`;
      } else {
        url = `${API_BASE}?page=${pageNum - 1}&size=${PAGE_SIZE}`;
      }

      console.log('Fetching from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const jsonData = await response.json();
      console.log('API Response:', jsonData);

      // Extract from the exact structure: { message, data: { content, page } }
      const content = jsonData?.data?.content || [];
      const pageInfo = jsonData?.data?.page || {};

      const totalPagesFromApi = pageInfo.totalPages || 1;
      const totalElementsFromApi = pageInfo.totalElements || content.length;

      setColleges(content);
      setTotalPages(totalPagesFromApi);
      setTotalElements(totalElementsFromApi);
      setPage(pageNum);

      console.log(`Loaded page ${pageNum}: ${content.length} colleges | Total: ${totalElementsFromApi} | Pages: ${totalPagesFromApi}`);
    } catch (err) {
      setError('Failed to load colleges. Please try again later.');
      console.error('Fetch error:', err);
      setColleges([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges('', 1);
  }, []);

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      fetchColleges(searchTerm.trim(), 1);
    } else {
      fetchColleges('', 1);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    fetchColleges('', 1);
  };

  const handlePageChange = (newPage) => {
    fetchColleges(searchTerm.trim(), newPage);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Colleges in Nepal</h1>

          {/* Search Bar */}
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search colleges by name, location, course, or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 pl-12 pr-36 py-4 text-lg bg-white border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              <button
                onClick={handleSearchClick}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchTerm && !loading && colleges.length > 0 && (
              <p className="mt-3 text-sm text-slate-600 text-center">
                Showing results for: <span className="font-medium">"{searchTerm}"</span>
              </p>
            )}
          </div>

          {/* Results */}
          <div className="flex-1">
            {loading && colleges.length === 0 ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : colleges.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <p className="text-slate-600 text-lg">
                  {searchTerm
                    ? `No colleges found for "${searchTerm}"`
                    : 'No colleges available at the moment.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {colleges.map((college) => (
                    <CollegeCard
                      key={college.collegeId} // Use collegeId as key
                      college={college}
                    />
                  ))}
                </div>

                <div className="mt-6 text-center text-slate-600">
                  Showing {(page - 1) * PAGE_SIZE + colleges.length} of {totalElements} college{totalElements !== 1 ? 's' : ''}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      isLoading={loading}
                      showPageInfo={true}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CollegesPage;