import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import useResource from "../../../hooks/useResource";

/**
 * ResourceImage - Optimized component for displaying resource images
 * Lightweight alternative to ResourceViewer for simple image display
 * 
 * @param {Object} props
 * @param {string} props.fileName - Name of the resource file
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.fallback - Fallback image URL
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.lazy - Enable lazy loading (default: true)
 * 
 * @example
 * <ResourceImage 
 *   fileName="product-image.jpg" 
 *   alt="Product"
 *   className="w-full h-64 object-cover rounded-lg"
 * />
 */
const ResourceImage = ({
  fileName,
  alt = "Image",
  className = "",
  fallback,
  onClick,
  lazy = true,
}) => {
  const [imageError, setImageError] = useState(false);
  
  const { url, loading, error } = useResource(fileName, { 
    autoLoad: true 
  });

  // Show loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  // Show error state or fallback
  if (error || imageError) {
    if (fallback) {
      return (
        <img
          src={fallback}
          alt={alt}
          className={className}
          onClick={onClick}
        />
      );
    }
    
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 ${className}`}>
        <AlertCircle className="w-6 h-6 text-gray-400 mb-2" />
        <p className="text-xs text-gray-500">Failed to load</p>
      </div>
    );
  }

  // Show image
  if (url) {
    return (
      <img
        src={url}
        alt={alt}
        className={className}
        onClick={onClick}
        loading={lazy ? "lazy" : "eager"}
        onError={() => setImageError(true)}
      />
    );
  }

  return null;
};

export default ResourceImage;
