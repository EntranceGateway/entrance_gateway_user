import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Reusable Button component
 * Provides consistent button styling across the application
 * 
 * @param {React.ReactNode} children - Button content
 * @param {string} variant - "primary" | "secondary" | "outline" | "danger" | "ghost"
 * @param {string} size - "sm" | "md" | "lg"
 * @param {boolean} isLoading - Shows loading spinner
 * @param {boolean} disabled - Disables the button
 * @param {boolean} fullWidth - Makes button full width
 * @param {string} type - Button type (button, submit, reset)
 * @param {React.ReactNode} leftIcon - Icon to show on the left
 * @param {React.ReactNode} rightIcon - Icon to show on the right
 * @param {Function} onClick - Click handler
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  leftIcon,
  rightIcon,
  onClick,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-slate-600 hover:bg-slate-100",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
  };

  const baseClasses = `
    inline-flex items-center justify-center 
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-blue-100
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;
