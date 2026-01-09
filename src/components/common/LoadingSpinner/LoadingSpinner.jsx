import React from "react";

/**
 * Reusable LoadingSpinner component
 * Provides consistent loading states across the application
 * 
 * @param {string} message - Loading message to display
 * @param {string} size - Size variant: "sm", "md", "lg"
 * @param {boolean} fullScreen - Whether to center in full viewport
 * @param {string} color - Tailwind color class (e.g., "blue", "indigo")
 */
const LoadingSpinner = ({ 
  message = "Loading...",
  size = "md",
  fullScreen = false,
  color = "blue"
}) => {
  const sizeClasses = {
    sm: "h-8 w-8 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-16 w-16 border-4",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center" 
    : "flex flex-col items-center justify-center py-20";

  return (
    <div className={containerClass}>
      <div 
        className={`
          animate-spin rounded-full 
          border-${color}-200 border-t-${color}-600 
          ${sizeClasses[size]}
        `}
        style={{
          borderTopColor: `var(--color-${color}-600, #2563eb)`,
          borderColor: `var(--color-${color}-200, #bfdbfe)`,
        }}
      />
      {message && (
        <p className={`mt-4 text-slate-500 font-medium ${textSizes[size]}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
