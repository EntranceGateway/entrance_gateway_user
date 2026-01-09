import React from "react";
import { Search, X, RefreshCw } from "lucide-react";

/**
 * Reusable SearchBar component
 * Provides consistent search functionality across the application
 * 
 * @param {string} value - Search input value
 * @param {Function} onChange - Input change handler
 * @param {Function} onSearch - Search submit handler
 * @param {Function} onClear - Clear input handler
 * @param {string} placeholder - Input placeholder text
 * @param {boolean} isLoading - Loading state
 * @param {string} buttonText - Search button text
 * @param {boolean} showButton - Whether to show search button
 */
const SearchBar = ({ 
  value = "",
  onChange,
  onSearch,
  onClear,
  placeholder = "Search...",
  isLoading = false,
  buttonText = "Search",
  showButton = true,
  className = ""
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`
          w-full pl-12 py-4 text-lg bg-white 
          border-2 border-slate-200 rounded-xl shadow-sm 
          focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
          transition-all
          ${showButton ? "pr-28" : "pr-12"}
        `}
      />
      
      {value && (
        <button
          onClick={handleClear}
          className={`absolute ${showButton ? "right-24" : "right-4"} p-1 text-slate-400 hover:text-slate-600 transition`}
          aria-label="Clear search"
          type="button"
        >
          <X size={20} />
        </button>
      )}
      
      {showButton && onSearch && (
        <button
          onClick={onSearch}
          disabled={isLoading}
          type="button"
          className="absolute right-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            buttonText
          )}
        </button>
      )}
    </div>
  );
};

export default SearchBar;
