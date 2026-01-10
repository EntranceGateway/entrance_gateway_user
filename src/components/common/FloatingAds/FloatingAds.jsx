import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getAds, filterAdsByPosition, AD_POSITIONS } from "../../../http/ads";

/**
 * FloatingAds - Professional corner & bottom advertisement component
 * 
 * Layout (No content gaps - ads float over footer area):
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    MAIN CONTENT                             │
 * │                    (No gaps needed)                         │
 * ├─────────────┬───────────────────────────────┬───────────────┤
 * │ LEFT CORNER │      BOTTOM BANNER            │ RIGHT CORNER  │
 * │     AD      │   (rotating multiple ads)     │     AD        │
 * └─────────────┴───────────────────────────────┴───────────────┘
 */

// Check if ad was dismissed (session-based - shows again on navigation)
const isAdDismissed = (adId) => {
  try {
    const dismissed = JSON.parse(sessionStorage.getItem("dismissedAds") || "{}");
    return !!dismissed[adId];
  } catch {
    return false;
  }
};

// Mark ad as dismissed for current session only
const dismissAd = (adId) => {
  try {
    const dismissed = JSON.parse(sessionStorage.getItem("dismissedAds") || "{}");
    dismissed[adId] = Date.now();
    sessionStorage.setItem("dismissedAds", JSON.stringify(dismissed));
  } catch {}
};

/**
 * Corner Ad - Small floating ad in bottom-left or bottom-right corner
 */
const CornerAd = ({ ad, position = "left", onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!ad || !isVisible || isAdDismissed(ad.id)) return null;

  const handleClose = () => {
    setIsVisible(false);
    dismissAd(ad.id);
    onDismiss?.(ad.id);
  };

  const positionClass = position === "left" 
    ? "left-3 bottom-14" 
    : "right-3 bottom-14";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`fixed ${positionClass} z-40 hidden md:block`}
    >
      <div className="relative group w-52">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-10 p-1 bg-gray-800/90 hover:bg-red-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Close"
        >
          <X className="w-3 h-3 text-white" />
        </button>

        {/* Ad Card */}
        <a
          href={ad.redirectUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
        >
          {/* Image */}
          <div className="relative h-24 overflow-hidden">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
            <span className="absolute top-1.5 left-1.5 text-[8px] font-medium text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
              Ad
            </span>
          </div>

          {/* Content */}
          <div className="p-2 bg-linear-to-r from-orange-50 to-amber-50">
            <h4 className="font-semibold text-gray-900 text-[11px] line-clamp-2 leading-tight">
              {ad.title}
            </h4>
            <p className="text-[9px] text-orange-600 font-medium mt-0.5">
              Learn More →
            </p>
          </div>
        </a>
      </div>
    </motion.div>
  );
};

/**
 * Bottom Banner Ad - Fixed full-width at very bottom with multiple rotating ads
 */
const BottomBanner = ({ ads = [], show = true }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Auto-rotate ads every 5 seconds
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
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
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="bg-linear-to-r from-orange-600 via-orange-500 to-amber-500">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-1/2 -translate-y-1/2 right-2 z-10 p-1 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Navigation Arrows */}
            {ads.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-0.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors hidden sm:block"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-white" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-10 top-1/2 -translate-y-1/2 z-10 p-0.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors hidden sm:block"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              </>
            )}

            {/* Ad Content - Compact */}
            <a
              href={currentAd.redirectUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="max-w-4xl mx-auto px-6 sm:px-10 py-2 flex items-center justify-center gap-3">
                {/* Image */}
                <div className="hidden sm:block shrink-0">
                  <img
                    src={currentAd.imageUrl}
                    alt={currentAd.title}
                    className="h-8 w-12 object-cover rounded shadow"
                  />
                </div>

                {/* Content */}
                <p className="text-white font-bold text-xs sm:text-sm truncate flex-1 text-center sm:text-left">
                  {currentAd.title}
                </p>

                {/* CTA */}
                <button className="shrink-0 bg-white text-orange-600 px-3 py-1 rounded font-bold text-xs hover:bg-orange-50 transition-colors shadow">
                  View
                </button>
              </div>
            </a>

            {/* Dots - Only show if multiple ads */}
            {ads.length > 1 && (
              <div className="flex justify-center gap-1 pb-1">
                {ads.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentAdIndex(idx)}
                    className={`h-0.5 rounded-full transition-all ${
                      idx === currentAdIndex
                        ? "w-3 bg-white"
                        : "w-1 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Main FloatingAds Container
 */
const FloatingAds = ({ showBottomBanner = true, showCornerAds = true }) => {
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedCorners, setDismissedCorners] = useState({});

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const ads = await getAds({ page: 0, size: 20 });
        setAllAds(ads);
      } catch (error) {
        console.error("Failed to fetch floating ads:", error);
        setAllAds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  if (loading) return null;

  // Get ads for bottom banner
  let bottomAds = filterAdsByPosition(allAds, AD_POSITIONS.FLOATING_BOTTOM);
  if (bottomAds.length === 0) {
    bottomAds = filterAdsByPosition(allAds, AD_POSITIONS.HORIZONTAL_2);
  }
  
  // Get ads for corner positions
  let cornerAds = filterAdsByPosition(allAds, AD_POSITIONS.FLOATING_RIGHT);
  if (cornerAds.length === 0) {
    cornerAds = [
      ...filterAdsByPosition(allAds, AD_POSITIONS.VERTICAL_1),
      ...filterAdsByPosition(allAds, AD_POSITIONS.VERTICAL_2),
    ];
  }

  const leftAd = cornerAds[0];
  const rightAd = cornerAds[1];

  const handleCornerDismiss = (adId) => {
    setDismissedCorners((prev) => ({ ...prev, [adId]: true }));
  };

  return (
    <>
      {/* Bottom Banner */}
      <BottomBanner ads={bottomAds} show={showBottomBanner} />

      {/* Corner Ads */}
      <AnimatePresence>
        {showCornerAds && leftAd && !dismissedCorners[leftAd.id] && (
          <CornerAd ad={leftAd} position="left" onDismiss={handleCornerDismiss} />
        )}
        {showCornerAds && rightAd && !dismissedCorners[rightAd.id] && (
          <CornerAd ad={rightAd} position="right" onDismiss={handleCornerDismiss} />
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAds;
export { BottomBanner, CornerAd };
