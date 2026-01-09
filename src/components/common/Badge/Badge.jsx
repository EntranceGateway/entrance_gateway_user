import React from "react";

/**
 * Reusable Badge component
 * Provides consistent badge/tag styling across the application
 * 
 * @param {React.ReactNode} children - Badge content
 * @param {string} variant - Color variant
 * @param {string} size - "sm" | "md" | "lg"
 */
const Badge = ({
  children,
  variant = "slate",
  size = "md",
  className = "",
}) => {
  const variants = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
    slate: "bg-slate-100 text-slate-700",
    indigo: "bg-indigo-100 text-indigo-700",
    amber: "bg-amber-100 text-amber-700",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
  };

  return (
    <span
      className={`
        inline-flex items-center 
        font-semibold rounded-full
        ${variants[variant] || variants.slate}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
