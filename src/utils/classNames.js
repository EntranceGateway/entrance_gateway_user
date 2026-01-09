/**
 * Common className utilities for consistent styling
 */

/**
 * Combines class names, filtering out falsy values
 * @param {...string} classes - Class names to combine
 * @returns {string} - Combined class string
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Common card styles
 */
export const cardStyles = {
  base: "bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden transition-all duration-300",
  hover: "hover:shadow-xl hover:scale-[1.02]",
  interactive: "cursor-pointer",
};

/**
 * Common button variants
 */
export const buttonStyles = {
  primary: "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50",
  secondary: "px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all",
  outline: "px-4 py-2 border-2 border-slate-200 text-slate-700 font-medium rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all",
  danger: "px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all",
  ghost: "px-4 py-2 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-all",
};

/**
 * Badge color variants
 */
export const badgeStyles = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-800",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
  slate: "bg-slate-100 text-slate-700",
};

/**
 * Creates badge class with base styles
 * @param {string} color - Color variant
 * @returns {string} - Complete badge class
 */
export const badge = (color = "slate") => {
  return cn(
    "text-xs px-3 py-1 rounded-full font-semibold",
    badgeStyles[color] || badgeStyles.slate
  );
};

/**
 * Common text truncation classes
 */
export const truncate = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
};

/**
 * Grid column configurations
 */
export const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};
