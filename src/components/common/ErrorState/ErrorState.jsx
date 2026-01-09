import React from "react";
import { AlertCircle, RefreshCw, FileX, Search } from "lucide-react";

/**
 * Reusable ErrorState component
 * Provides consistent error display across the application
 * 
 * @param {string} title - Error title
 * @param {string} message - Error description
 * @param {Function} onRetry - Retry callback function
 * @param {string} retryText - Custom retry button text
 * @param {string} variant - "error" | "empty" | "not-found"
 */
const ErrorState = ({ 
  title,
  message,
  onRetry,
  retryText = "Try Again",
  variant = "error"
}) => {
  const variants = {
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
      borderColor: "border-red-100",
      buttonBg: "bg-red-100 hover:bg-red-200 text-red-700",
      defaultTitle: "Something went wrong",
      defaultMessage: "Failed to load data. Please try again later."
    },
    empty: {
      icon: FileX,
      bgColor: "bg-slate-50",
      iconColor: "text-slate-400",
      borderColor: "border-slate-200",
      buttonBg: "bg-slate-100 hover:bg-slate-200 text-slate-700",
      defaultTitle: "No data available",
      defaultMessage: "There's nothing here yet."
    },
    "not-found": {
      icon: Search,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-400",
      borderColor: "border-orange-100",
      buttonBg: "bg-orange-100 hover:bg-orange-200 text-orange-700",
      defaultTitle: "No results found",
      defaultMessage: "Try adjusting your search or filters."
    }
  };

  const config = variants[variant] || variants.error;
  const Icon = config.icon;

  return (
    <div className={`text-center py-16 bg-white rounded-2xl border-2 ${config.borderColor}`}>
      <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-8 h-8 ${config.iconColor}`} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {title || config.defaultTitle}
      </h3>
      
      <p className="text-slate-500 max-w-sm mx-auto">
        {message || config.defaultMessage}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className={`mt-6 px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition ${config.buttonBg}`}
        >
          <RefreshCw size={16} />
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
