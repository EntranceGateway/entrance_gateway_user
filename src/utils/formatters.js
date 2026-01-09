/**
 * Common text formatting utilities
 * Extracted from components for reusability
 */

/**
 * Formats course name by removing prefix and formatting
 * @param {string} name - Raw course name (e.g., "prefix_CSIT_Programming")
 * @returns {string} - Formatted name (e.g., "Csit Programming")
 */
export const formatCourseName = (name) => {
  if (!name) return "";
  return name
    .split("_")
    .slice(1)
    .join("_")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Formats note name by removing prefix and file extension
 * @param {string} name - Raw note name (e.g., "prefix_Chapter_1.pdf")
 * @returns {string} - Formatted name (e.g., "Chapter 1")
 */
export const formatNoteName = (name) => {
  if (!name) return "";
  return name
    .split("_")
    .slice(1)
    .join("_")
    .replace(/\.pdf$/i, "")
    .replace(/_/g, " ");
};

/**
 * Formats file name by removing extension and special characters
 * @param {string} name - Raw filename
 * @returns {string} - Clean name
 */
export const formatFileName = (name) => {
  if (!name) return "";
  const afterUnderscore = name.includes("_") 
    ? name.split("_").slice(1).join("_") 
    : name;
  return afterUnderscore
    .replace(/\.(png|jpg|jpeg|pdf|webp)$/i, "")
    .trim();
};

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

/**
 * Capitalizes first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} - Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Gets user initials from full name
 * @param {string} fullName - User's full name
 * @returns {string} - Initials (e.g., "JD" for "John Doe")
 */
export const getInitials = (fullName) => {
  if (!fullName) return "U";
  const names = fullName.trim().split(" ");
  const first = names[0]?.[0] || "";
  const last = names.length > 1 ? names[names.length - 1]?.[0] : "";
  return (first + last).toUpperCase() || "U";
};

/**
 * Formats number with suffix (K, M, B)
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  if (!num || isNaN(num)) return "0";
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Formats date to readable string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options,
    }).format(dateObj);
  } catch {
    return "";
  }
};

/**
 * Formats relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now - dateObj;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return "";
  }
};
