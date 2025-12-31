// src/pages/CollegesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import CollegeCard from '../../components/collegecard/CollegeCard';
import DashboardLayout from '../../components/layout/DashboardLayout';

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Ref to store the timeout ID for debouncing
  const debounceTimeoutRef = useRef(null);

  // Fetch colleges based on search term
  const fetchColleges = async (query = '') => {
    try {
      setLoading(true);
      setError(null);

      let url = 'http://185.177.116.173:8080/api/v1/colleges';
      if (query.trim()) {
        url = `http://185.177.116.173:8080/api/v1/colleges/search?query=${encodeURIComponent(query.trim())}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch colleges');

      const data = await response.json();
      // Adjust based on actual API response structure
      const collegeList = data?.data?.content || data?.data || [];

      setColleges(collegeList);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching colleges:', err);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load: fetch all colleges
  useEffect(() => {
    fetchColleges();
  }, []);

  // Debounced search when user types
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout (500ms delay)
    debounceTimeoutRef.current = setTimeout(() => {
      fetchColleges(searchTerm);
    }, 500);

    // Cleanup timeout on unmount or when searchTerm changes
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Colleges in Nepal</h1>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search colleges by name, location, course, or university..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-12 py-4 text-lg bg-white border border-slate-300 rounded-xl 
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition-all"
            />
            {/* Search Icon */}
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {/* Clear Button (only when typing) */}
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {searchTerm && (
            <p className="mt-3 text-sm text-slate-600 text-center">
              Showing results for: <span className="font-medium">"{searchTerm}"</span>
            </p>
          )}
        </div>

        {/* College Cards Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <p className="text-red-600 text-lg">Error: {error}</p>
              <p className="text-sm text-slate-500 mt-2">Please try again later.</p>
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <p className="text-slate-600 text-lg">
                {searchTerm
                  ? `No colleges found for "${searchTerm}"`
                  : 'No colleges available at the moment.'}
              </p>
              {searchTerm && (
                <p className="text-sm text-slate-500 mt-2">Try different keywords.</p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              <div className="mt-8 text-center text-slate-600">
                Showing {colleges.length} college{colleges.length !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default CollegesPage;