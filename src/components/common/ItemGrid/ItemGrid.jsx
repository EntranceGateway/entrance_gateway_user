import React from "react";

/**
 * Reusable ItemGrid component
 * Provides consistent grid layout for displaying items
 * 
 * @param {Array} items - Array of items to display
 * @param {Function} renderItem - Function to render each item
 * @param {string} keyExtractor - Function to extract unique key from item
 * @param {number} columns - Number of columns (1-4)
 * @param {string} gap - Gap size between items
 * @param {boolean} animated - Whether to add hover animations
 */
const ItemGrid = ({ 
  items = [],
  renderItem,
  keyExtractor = (item, index) => item?.id || index,
  columns = 3,
  gap = "8",
  animated = true,
  className = ""
}) => {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  const gapClasses = {
    "4": "gap-4",
    "6": "gap-6",
    "8": "gap-8",
  };

  return (
    <div className={`grid ${columnClasses[columns] || columnClasses[3]} ${gapClasses[gap] || gapClasses["8"]} ${className}`}>
      {items.map((item, index) => (
        <div 
          key={keyExtractor(item, index)} 
          className={animated ? "transform transition duration-300 hover:scale-[1.02]" : ""}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default ItemGrid;
