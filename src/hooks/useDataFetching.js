import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Custom hook for data fetching with loading, error, and pagination states
 * Simplifies repetitive data fetching patterns across the application
 * 
 * @param {Function} fetchFn - Async function that fetches data
 * @param {Object} options - Configuration options
 * @returns {Object} - Data, loading, error states and helper functions
 * 
 * @example
 * const { data, loading, error, refetch } = useDataFetching(
 *   () => api.get('/notes'),
 *   { initialData: [], autoFetch: true }
 * );
 */
const useDataFetching = (fetchFn, options = {}) => {
  const {
    initialData = null,
    autoFetch = true,
    onSuccess,
    onError,
    transform,
    deps = [],
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFn(...args);
      const transformedData = transform ? transform(result) : result;
      
      setData(transformedData);
      onSuccess?.(transformedData);
      
      return transformedData;
    } catch (err) {
      const errorMessage = err?.message || "Something went wrong";
      setError(errorMessage);
      onError?.(err);
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, transform, onSuccess, onError]);

  const refetch = useCallback((...args) => fetch(...args), [fetch]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    loading,
    error,
    fetch,
    refetch,
    reset,
    setData,
  };
};

/**
 * Custom hook for paginated data fetching
 * Extends useDataFetching with pagination support
 * 
 * @param {Function} fetchFn - Async function that fetches paginated data
 * @param {Object} options - Configuration options
 * @returns {Object} - Paginated data states and helper functions
 */
export const usePaginatedFetching = (fetchFn, options = {}) => {
  const {
    pageSize = 12,
    initialPage = 1,
    ...fetchOptions
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { data, loading, error, fetch, refetch, reset, setData } = useDataFetching(
    fetchFn,
    {
      ...fetchOptions,
      autoFetch: false,
    }
  );

  const fetchPage = useCallback(async (page = currentPage) => {
    const result = await fetch(page, pageSize);
    
    if (result?.totalPages !== undefined) {
      setTotalPages(result.totalPages);
    }
    if (result?.totalItems !== undefined) {
      setTotalItems(result.totalItems);
    }
    
    setCurrentPage(page);
    return result;
  }, [fetch, currentPage, pageSize]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      fetchPage(page);
    }
  }, [fetchPage, totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Client-side pagination helper
  const paginatedData = useMemo(() => {
    if (!Array.isArray(data)) return data;
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  useEffect(() => {
    if (fetchOptions.autoFetch !== false) {
      fetchPage(initialPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    paginatedData,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    fetchPage,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
    setTotalPages,
    refetch,
    reset,
    setData,
  };
};

export default useDataFetching;
