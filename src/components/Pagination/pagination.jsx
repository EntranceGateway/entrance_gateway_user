import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Universal Pagination Component
 * 
 * A reusable, beautifully designed pagination component with Framer Motion animations
 * and Tailwind styling that matches modern UI/UX patterns.
 * 
 * Props:
 * - currentPage: current page number (1-indexed)
 * - totalPages: total number of pages
 * - onPageChange: callback when page changes (receives new page number)
 * - isLoading: optional loading state to disable pagination
 * - maxVisible: max page numbers to show (default: 5)
 * - className: optional additional classes
 * - showPageInfo: show "Page X of Y" text (default: true)
 * 
 * Example:
 * <Pagination 
 *   currentPage={page} 
 *   totalPages={totalPages} 
 *   onPageChange={setPage}
 *   isLoading={loading}
 * />
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isLoading = false,
  maxVisible = 5,
  className = "",
  showPageInfo = true,
}) => {
  const [inputValue, setInputValue] = useState("");

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const pages = [];
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const halfVisible = Math.floor(maxVisible / 2);
      let start = Math.max(2, currentPage - halfVisible);
      let end = Math.min(totalPages - 1, currentPage + halfVisible);

      // Adjust range to maintain maxVisible count
      if (end - start < maxVisible - 3) {
        if (start === 2) {
          end = Math.min(totalPages - 1, start + maxVisible - 3);
        } else {
          start = Math.max(2, end - maxVisible + 3);
        }
      }

      // Add ellipsis and range
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push("...");

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisible]);

  const handlePageClick = (page) => {
    if (!isLoading && page !== currentPage && typeof page === "number") {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJumpToPage = () => {
    const page = parseInt(inputValue);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageClick(page);
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJumpToPage();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  if (totalPages <= 1) return null;

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col gap-4 items-center justify-center mt-8 ${className}`}
      aria-label="Pagination Navigation"
    >
      {/* Page Info */}
      {showPageInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-medium text-gray-600"
        >
          Page <span className="font-bold text-blue-600">{currentPage}</span> of{" "}
          <span className="font-bold text-gray-900">{totalPages}</span>
        </motion.div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Previous Button */}
        <motion.button
          variants={buttonVariants}
          whileHover={!isLoading && currentPage > 1 ? "hover" : {}}
          whileTap={!isLoading && currentPage > 1 ? "tap" : {}}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={isLoading || currentPage === 1}
          className="p-2 rounded-lg border-2 border-blue-300 bg-white text-blue-600 font-semibold hover:bg-blue-50 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label="Previous Page"
        >
          <ChevronLeft size={20} />
        </motion.button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === "...") {
              return (
                <motion.span
                  key={`ellipsis-${idx}`}
                  className="px-3 py-2 text-gray-400 font-semibold"
                >
                  …
                </motion.span>
              );
            }

            const isActive = page === currentPage;
            return (
              <motion.button
                key={page}
                variants={buttonVariants}
                whileHover={!isLoading && page !== currentPage ? "hover" : {}}
                whileTap={!isLoading ? "tap" : {}}
                onClick={() => handlePageClick(page)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg font-semibold transition-all min-w-10 ${
                  isActive
                    ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                    : "border-2 border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </motion.button>
            );
          })}
        </div>

        {/* Next Button */}
        <motion.button
          variants={buttonVariants}
          whileHover={!isLoading && currentPage < totalPages ? "hover" : {}}
          whileTap={!isLoading && currentPage < totalPages ? "tap" : {}}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={isLoading || currentPage === totalPages}
          className="p-2 rounded-lg border-2 border-blue-300 bg-white text-blue-600 font-semibold hover:bg-blue-50 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label="Next Page"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Jump to Page Input */}
      {totalPages > 10 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mt-2"
        >
          <label className="text-sm font-medium text-gray-600">Jump to:</label>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            placeholder="Page #"
            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
          />
          <motion.button
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
            onClick={handleJumpToPage}
            disabled={isLoading || !inputValue}
            className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Go
          </motion.button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Pagination;
