import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getAds, filterAdsByPosition, AD_POSITIONS } from "../../../http/ads";

/**
 * FloatingAds - Slim bottom banner advertisement (like IELTS/British Council style)
 * 
 * Layout:
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ [Logo/Image] │  Ad Title & Description  │  [CTA Button]  │ [X]          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Check if ad was dismissed (session-based)
const isAdDismissed = (adId) => {
  try {
    const dismissed = JSON.parse(sessionStorage.getItem("dismissedAds") || "{}");
    return !!dismissed[adId];
  } catch {
    return false;
  }
};

// Mark ad as dismissed
const dismissAd = (adId) => {
  try {
    const dismissed = JSON.parse(sessionStorage.getItem("dismissedAds") || "{}");
    dismissed[adId] = Date.now();
    sessionStorage.setItem("dismissedAds", JSON.stringify(dismissed));
  } catch {}
};

/**
 * Slim Bottom Banner - Fixed at bottom of screen (like IELTS ad style)
 */
const SlimBottomBanner = ({ ads = [], show = true }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Auto-rotate ads every 6 seconds
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (!show || ads.length === 0 || !isVisible || isAdDismissed("bottom-banner")) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  const handleClose = () => {
    setIsVisible(false);
    dismissAd("bottom-banner");
  };

  const goToPrev = () => {
    setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const goToNext = () => {
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
  };

  return (
    <AnimatePresence>
      {isVisible && currentAd && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          {/* Slim Banner Container */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-t border-gray-700">
            <div className="max-w-7xl mx-auto relative">
              {/* Main Content */}
              <a
                href={currentAd.redirectUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2.5 sm:py-3 pr-14 sm:pr-24 hover:bg-white/5 transition-colors"
              >
                {/* Ad Image/Logo */}
                <div className="shrink-0 hidden sm:block">
                  <img
                    src={currentAd.imageUrl}
                    alt={currentAd.title}
                    className="h-9 w-14 sm:h-10 sm:w-16 object-cover rounded border border-gray-600"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Mobile Image */}
                    <img
                      src={currentAd.imageUrl}
                      alt=""
                      className="h-7 w-10 object-cover rounded sm:hidden shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {currentAd.title}
                      </p>
                      {currentAd.description && (
                        <p className="text-gray-400 text-xs truncate hidden sm:block">
                          {currentAd.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="shrink-0">
                  <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-lg">
                    View Details
                  </span>
                </div>
              </a>

              {/* Navigation & Close Controls */}
              <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Navigation Arrows */}
                {ads.length > 1 && (
                  <div className="hidden md:flex items-center gap-1 mr-2">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToPrev(); }}
                      className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
                      title="Previous"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-white" />
                    </button>
                    <span className="text-xs text-gray-400 mx-1 tabular-nums">
                      {currentAdIndex + 1}/{ads.length}
                    </span>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToNext(); }}
                      className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
                      title="Next"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="p-1.5 bg-white/10 hover:bg-red-500/80 rounded-full transition-colors group"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5 text-gray-300 group-hover:text-white" />
                </button>
              </div>

              {/* Ad Label */}
              <span className="absolute left-4 -top-0.5 text-[8px] font-medium text-gray-500 uppercase tracking-wider hidden sm:block">
                Sponsored
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Main FloatingAds Container - Uses ads API properly
 */
const FloatingAds = ({ showBottomBanner = true }) => {
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        setError(null);
        const ads = await getAds({ page: 0, size: 20 });
        setAllAds(ads || []);
      } catch (err) {
        console.error("Failed to fetch floating ads:", err);
        setError(err);
        setAllAds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Don't render while loading or on error
  if (loading || error) return null;

  // Get ads for bottom banner - try multiple positions as fallback
  let bottomAds = filterAdsByPosition(allAds, AD_POSITIONS.FLOATING_BOTTOM);
  if (bottomAds.length === 0) {
    bottomAds = filterAdsByPosition(allAds, AD_POSITIONS.HORIZONTAL_2);
  }
  if (bottomAds.length === 0) {
    bottomAds = filterAdsByPosition(allAds, AD_POSITIONS.HORIZONTAL_1);
  }
  // Final fallback - use any available ads
  if (bottomAds.length === 0 && allAds.length > 0) {
    bottomAds = allAds.slice(0, 5);
  }

  return (
    <SlimBottomBanner ads={bottomAds} show={showBottomBanner} />
  );
};

export default FloatingAds;
export { SlimBottomBanner };
