import React from "react";

/**
 * Reusable Skeleton component for loading placeholders
 * 
 * @param {string} variant - "text" | "circle" | "rectangle" | "card"
 * @param {string|number} width - Width of skeleton
 * @param {string|number} height - Height of skeleton
 * @param {number} count - Number of skeleton items to render
 * @param {string} className - Additional CSS classes
 */
const Skeleton = ({
  variant = "text",
  width,
  height,
  count = 1,
  className = "",
}) => {
  const baseClasses = "bg-gray-200 animate-pulse";

  const variantClasses = {
    text: "h-4 rounded",
    circle: "rounded-full",
    rectangle: "rounded-lg",
    card: "rounded-2xl",
  };

  const getStyle = () => {
    const style = {};
    if (width) style.width = typeof width === "number" ? `${width}px` : width;
    if (height) style.height = typeof height === "number" ? `${height}px` : height;
    return style;
  };

  const skeletonClass = `${baseClasses} ${variantClasses[variant] || variantClasses.text} ${className}`;

  if (count === 1) {
    return <div className={skeletonClass} style={getStyle()} />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass} style={getStyle()} />
      ))}
    </>
  );
};

/**
 * Pre-built skeleton for card layouts
 */
export const CardSkeleton = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div 
        key={i} 
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
      >
        <Skeleton variant="rectangle" height={192} className="w-full" />
        <div className="p-5 space-y-3">
          <Skeleton width="75%" height={24} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="66%" height={16} />
        </div>
      </div>
    ))}
  </>
);

/**
 * Pre-built skeleton for grid layouts
 */
export const GridSkeleton = ({ count = 8, columns = 4 }) => {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid ${columnClasses[columns] || columnClasses[4]} gap-8`}>
      <CardSkeleton count={count} />
    </div>
  );
};

export default Skeleton;
