import React from "react";

/**
 * Reusable PageHeader component
 * Provides consistent page headers across the application
 * 
 * @param {string} title - Main heading text
 * @param {string} subtitle - Secondary description text
 * @param {React.ReactNode} children - Optional content (search bar, filters, etc.)
 * @param {string} className - Additional CSS classes
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  children,
  className = "" 
}) => {
  return (
    <header className={`mb-8 ${className}`}>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-lg text-slate-500">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </header>
  );
};

export default PageHeader;
