import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable Pagination Component
 * 
 * Props:
 * - page or currentPage: current page (1-based)
 * - totalPages: total number of pages
 * - onPageChange: callback with new page number (1-based)
 * - isLoading/isDisabled: disable interactions
 * - showPageInfo: show "Page X of Y" text
 */
const Pagination = ({
  page,
  currentPage,
  totalPages = 1,
  onPageChange,
  isLoading = false,
  isDisabled = false,
  showPageInfo = true,
}) => {
  // Support both prop names
  const activePage = Math.max(1, Number(page ?? currentPage) || 1);
  const total = Math.max(1, Number(totalPages) || 1);
  const disabled = isLoading || isDisabled;

  // Don't render if only 1 page
  if (total <= 1) return null;

  const handlePrev = () => {
    if (activePage > 1 && !disabled) {
      onPageChange(activePage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (activePage < total && !disabled) {
      onPageChange(activePage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = total > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (activePage > 3) pages.push("...");

    // Pages around current
    const start = Math.max(2, activePage - 1);
    const end = Math.min(total - 1, activePage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (activePage < total - 2) pages.push("...");

    // Always show last page
    if (total > 1) pages.push(total);

    return pages;
  };

  return (
    <nav
      className="flex flex-col items-center gap-4 mt-10"
      aria-label="Pagination"
    >
      {/* Page Info */}
      {showPageInfo && (
        <p className="text-sm font-medium text-gray-600">
          Page <span className="text-blue-600 font-bold">{activePage}</span> of{" "}
          <span className="font-bold">{total}</span>
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          disabled={activePage === 1 || disabled}
          aria-label="Previous page"
          className={`flex items-center gap-1 px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-all duration-200
            ${activePage === 1 || disabled
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md"
            }`}
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, idx) =>
            pageNum === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-gray-400 font-medium"
              >
                …
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => pageNum !== activePage && !disabled && onPageChange(pageNum)}
                disabled={disabled}
                aria-current={pageNum === activePage ? "page" : undefined}
                className={`min-w-[40px] h-10 rounded-lg font-semibold text-sm transition-all duration-200
                  ${pageNum === activePage
                    ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : disabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
              >
                {pageNum}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={activePage === total || disabled}
          aria-label="Next page"
          className={`flex items-center gap-1 px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-all duration-200
            ${activePage === total || disabled
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md"
            }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
