import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, ChevronRight, Sparkles } from "lucide-react";
import { getAds, filterAdsByPosition, AD_POSITIONS } from "../../http/ads";

/**
 * Single Ad Card Component
 */
const AdCard = ({ ad, variant = "default", onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!ad || !isVisible) return null;

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    onDismiss?.(ad.id);
  };

  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${
        isFeatured ? "bg-linear-to-br from-orange-500 to-amber-500" : "bg-white"
      }`}
    >
      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 z-10 p-1 bg-black/20 hover:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Close"
      >
        <X className="w-3 h-3 text-white" />
      </button>

      {/* Sponsored Label */}
      <span className={`absolute top-2 left-2 z-10 text-[10px] font-medium px-2 py-0.5 rounded-full ${
        isFeatured ? "bg-white/30 text-white" : "bg-gray-100 text-gray-500"
      }`}>
        Ad
      </span>

      <a
        href={ad.redirectUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* Ad Image */}
        <div className={`relative overflow-hidden ${isCompact ? "h-24" : "h-32"}`}>
          {!imageError && ad.imageUrl ? (
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              isFeatured ? "bg-orange-400" : "bg-linear-to-br from-orange-100 to-amber-100"
            }`}>
              <Sparkles className={`w-8 h-8 ${isFeatured ? "text-white/60" : "text-orange-300"}`} />
            </div>
          )}
          <div className={`absolute inset-0 ${
            isFeatured ? "bg-black/20" : "bg-linear-to-t from-black/60 via-transparent to-transparent"
          }`} />
        </div>

        {/* Content */}
        <div className={`p-3 ${isFeatured ? "text-white" : ""}`}>
          <h4 className={`font-bold text-sm leading-tight mb-1 line-clamp-2 ${
            isFeatured ? "text-white" : "text-gray-800"
          }`}>
            {ad.title}
          </h4>
          
          {!isCompact && ad.bannerName && (
            <p className={`text-xs mb-2 line-clamp-1 ${
              isFeatured ? "text-white/80" : "text-gray-500"
            }`}>
              {ad.bannerName}
            </p>
          )}

          {/* CTA */}
          <div className={`flex items-center gap-1 text-xs font-semibold ${
            isFeatured ? "text-white" : "text-orange-600"
          }`}>
            <span>Learn More</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </a>
    </motion.div>
  );
};

/**
 * Skeleton loader for ads
 */
const AdSkeleton = ({ variant = "default" }) => {
  const isCompact = variant === "compact";
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className={`bg-gray-200 ${isCompact ? "h-24" : "h-32"}`} />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        {!isCompact && <div className="h-3 bg-gray-200 rounded w-1/2" />}
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
};

/**
 * AdsPanel - Professional sidebar ads panel
 */
const AdsPanel = ({ maxAds = 4, showTitle = true }) => {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedAds, setDismissedAds] = useState({});

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        const allAds = await getAds({ page: 0, size: 20 });
        
        // Get sidebar ads (vertical positions)
        const sidebarAds = [
          ...filterAdsByPosition(allAds, AD_POSITIONS.VERTICAL_1),
          ...filterAdsByPosition(allAds, AD_POSITIONS.VERTICAL_2),
          ...filterAdsByPosition(allAds, AD_POSITIONS.VERTICAL_3),
          ...filterAdsByPosition(allAds, AD_POSITIONS.VERTICAL_4),
          ...filterAdsByPosition(allAds, AD_POSITIONS.FLOATING_RIGHT),
        ];

        // If no sidebar-specific ads, use horizontal ads
        const displayAds = sidebarAds.length > 0 
          ? sidebarAds 
          : allAds.slice(0, maxAds);

        setAds(displayAds.slice(0, maxAds));
      } catch (error) {
        console.error("Failed to fetch ads:", error);
        setAds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [maxAds]);

  const handleDismiss = (adId) => {
    setDismissedAds((prev) => ({ ...prev, [adId]: true }));
  };

  const visibleAds = ads.filter((ad) => !dismissedAds[ad.id]);

  return (
    <div className="h-full p-4 space-y-4">
      {/* Header */}
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Sponsored
          </h3>
        </div>
      )}

      {/* Ads List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            // Loading skeletons
            <>
              <AdSkeleton variant="featured" />
              <AdSkeleton variant="compact" />
              <AdSkeleton variant="compact" />
            </>
          ) : visibleAds.length > 0 ? (
            // Display ads
            visibleAds.map((ad, index) => (
              <AdCard
                key={ad.id}
                ad={ad}
                variant={index === 0 ? "featured" : "compact"}
                onDismiss={handleDismiss}
              />
            ))
          ) : (
            // No ads placeholder
            <div className="text-center py-8 text-gray-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No ads available</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {visibleAds.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center">
            Advertisements help support our platform
          </p>
        </div>
      )}
    </div>
  );
};

export default AdsPanel;
