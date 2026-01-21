import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

function SortButtons({ sortDir, setSortDir }) {
  // Determine which direction is currently active
  const isAsc = sortDir === "asc";
  const isDesc = sortDir === "desc";

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Unified toggle button with current direction indicator */}
      <button
        onClick={() => setSortDir(isAsc ? "desc" : "asc")}
        className={`
          group flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm
          transition-all duration-300 ease-in-out
          border border-gray-300 dark:border-gray-600
          ${
            (isAsc || isDesc)
              ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-sm"
              : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow"
          }
          hover:-translate-y-0.5 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        `}
        aria-label={`Sort ${isAsc ? "descending" : "ascending"}`}
      >
        <ArrowUpDown className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span>Sort by Date</span>
        
        {/* Show current direction with icon */}
        {isAsc && <ArrowUp className="h-4 w-4 text-indigo-600 animate-pulse" />}
        {isDesc && <ArrowDown className="h-4 w-4 text-indigo-600 animate-pulse" />}
      </button>

      {/* Optional separate buttons if you prefer explicit control */}
      {/* You can remove or keep these depending on your preference */}
      <button
        onClick={() => setSortDir("asc")}
        className={`
          flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200
          ${isAsc 
            ? "bg-indigo-600 text-white shadow-md" 
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}
          hover:shadow active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        `}
      >
        <ArrowUp className="h-4 w-4" />
        Ascending
      </button>

      <button
        onClick={() => setSortDir("desc")}
        className={`
          flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200
          ${isDesc 
            ? "bg-indigo-600 text-white shadow-md" 
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}
          hover:shadow active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        `}
      >
        <ArrowDown className="h-4 w-4" />
        Descending
      </button>
    </div>
  );
}

export default SortButtons;