import { useState, useEffect } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import AdsPanel from "./AdsPanel";
import { getAds, filterAdsByPosition, AD_POSITIONS } from "../../http/ads";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

/**
 * DashboardLayout - Main layout wrapper with professional floating ads
 * 
 * Layout:
 * ┌────────────────────────────────────────────────────────────────┐
 * │                          NAVBAR                                 │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                 │
 * │                      MAIN CONTENT                               │
 * │                                                                 │
 * ├────────────────────────────────────────────────────────────────┤
 * │                          FOOTER                                 │
 * └────────────────────────────────────────────────────────────────┘
 * 
 * FLOATING ADS (fixed position, don't scroll with content):
 * ┌──────────────┐                              ┌──────────────┐
 * │  LEFT        │                              │  RIGHT       │
 * │  CORNER AD   │                              │  CORNER AD   │
 * │  (floating)  │                              │  (floating)  │
 * └──────────────┘                              └──────────────┘
 * ┌────────────────────────────────────────────────────────────────┐
 * │  FIXED BOTTOM BANNER - Full width with image + text + CTA      │
 * └────────────────────────────────────────────────────────────────┘
 */

// Check if ad was dismissed (24 hour expiry)
const isAdDismissed = (adId) => {
  try {
    const dismissed = JSON.parse(localStorage.getItem("dismissedAds") || "{}");
    const dismissedTime = dismissed[adId];
    if (!dismissedTime) return false;
    const hoursSinceDismiss = (Date.now() - dismissedTime) / (1000 * 60 * 60);
    return hoursSinceDismiss < 24;
  } catch {
    return false;
  }
};

const dismissAd = (adId) => {
  try {
    const dismissed = JSON.parse(localStorage.getItem("dismissedAds") || "{}");
    dismissed[adId] = Date.now();
    localStorage.setItem("dismissedAds", JSON.stringify(dismissed));
  } catch {}
};

/**
 * Floating Corner Ad - Like cookie consent popup style
 * Fixed position in bottom-left or bottom-right corner
 */
const FloatingCornerAd = ({ ad, position = "left", onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!ad || !isVisible || isAdDismissed(ad.id)) return null;

  const handleClose = () => {
    setIsVisible(false);
    dismissAd(ad.id);
    onDismiss?.(ad.id);
  };

  const positionClasses = position === "left" 
    ? "left-4 bottom-20" 
    : "right-4 bottom-20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed ${positionClasses} z-40 hidden md:block`}
    >
      <div className="w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 p-1 bg-gray-100 hover:bg-red-100 rounded-full transition-colors group"
          title="Close"
        >
          <X className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
        </button>

        {/* Ad Image */}
        <div className="relative h-32 overflow-hidden">
          <img 
            src={ad.imageUrl} 
            alt={ad.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <span className="absolute top-2 left-2 text-[10px] font-medium text-white/90 bg-black/40 px-2 py-0.5 rounded-full">
            Sponsored
          </span>
        </div>

        {/* Ad Content */}
        <div className="p-4">
          <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
            {ad.title}
          </h4>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
            {ad.bannerName || "Special offer for you"}
          </p>
          
          {/* CTA Button */}
          <a
            href={ad.redirectUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-colors"
          >
            Learn More
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Fixed Bottom Banner - Full width sticky banner like Google Ads
 */
const FixedBottomBanner = ({ ads = [] }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  const currentAd = ads[currentAdIndex];

  if (!currentAd || !isVisible || isAdDismissed("fixed-bottom-banner")) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    dismissAd("fixed-bottom-banner");
  };

  const goToPrev = () => setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
  const goToNext = () => setCurrentAdIndex((prev) => (prev + 1) % ads.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        {/* Main Banner Container */}
        <div className="bg-gray-900 shadow-2xl border-t border-gray-700">
          <div className="max-w-7xl mx-auto relative">
            
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-1/2 -translate-y-1/2 right-3 z-10 p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Close ad"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation Arrows */}
            {ads.length > 1 && (
              <>
                <button 
                  onClick={goToPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors hidden sm:block"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={goToNext}
                  className="absolute right-12 top-1/2 -translate-y-1/2 z-10 p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors hidden sm:block"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Ad Content */}
            <a 
              href={currentAd.redirectUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 px-12 sm:px-20 py-3"
            >
              {/* Ad Image */}
              <div className="hidden sm:block shrink-0">
                <img 
                  src={currentAd.imageUrl} 
                  alt={currentAd.title}
                  className="h-12 w-20 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Logo/Icon placeholder */}
              <div className="hidden lg:flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg shrink-0">
                <span className="text-white font-bold text-lg">E</span>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-white font-bold text-base sm:text-lg truncate">
                  {currentAd.title}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm truncate hidden sm:block">
                  {currentAd.bannerName || "Limited time offer"}
                </p>
              </div>

              {/* CTA Button */}
              <button className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors shadow-lg">
                See More
              </button>
            </a>

            {/* Ad indicator dots */}
            {ads.length > 1 && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5">
                {ads.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={(e) => { e.preventDefault(); setCurrentAdIndex(idx); }}
                    className={`h-1 rounded-full transition-all ${
                      idx === currentAdIndex 
                        ? "w-4 bg-orange-500" 
                        : "w-1.5 bg-gray-600 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Ad label */}
            <span className="absolute top-1 left-3 text-[10px] text-gray-500">
              Ad
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const DashboardLayout = ({ 
  children, 
  showAds = false,
  showFloatingAds = true
}) => {
  const [allAds, setAllAds] = useState([]);
  const [dismissedCorners, setDismissedCorners] = useState({});

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const ads = await getAds();
        setAllAds(ads);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      }
    };
    if (showFloatingAds) fetchAds();
  }, [showFloatingAds]);

  // Get ads for bottom banner
  let bottomAds = filterAdsByPosition(allAds, AD_POSITIONS.FLOATING_BOTTOM);
  if (bottomAds.length === 0) bottomAds = filterAdsByPosition(allAds, AD_POSITIONS.HORIZONTAL_2);
  
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
  const hasBottomBanner = showFloatingAds && bottomAds.length > 0;

  const handleCornerDismiss = (adId) => {
    setDismissedCorners((prev) => ({ ...prev, [adId]: true }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 box-border">

      {/* Navbar */}
      <div className="w-full box-border">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full box-border">
        <div className="flex flex-1 gap-0 box-border">
          <main className="flex-1 bg-white shadow rounded-lg p-6 box-border">
            {children}
          </main>
          {showAds && (
            <aside className="hidden lg:block w-64 box-border">
              <AdsPanel />
            </aside>
          )}
        </div>
      </div>

      {/* Footer - Bottom padding when fixed banner is shown */}
      <div className={`w-full box-border ${hasBottomBanner ? 'pb-16' : ''}`}>
        <Footer />
      </div>

      {/* FLOATING ADS - Fixed position, don't scroll with content */}
      {showFloatingAds && allAds.length > 0 && (
        <>
          {/* Left Corner Floating Ad */}
          <AnimatePresence>
            {leftAd && !dismissedCorners[leftAd.id] && (
              <FloatingCornerAd 
                ad={leftAd} 
                position="left" 
                onDismiss={handleCornerDismiss}
              />
            )}
          </AnimatePresence>

          {/* Right Corner Floating Ad */}
          <AnimatePresence>
            {rightAd && !dismissedCorners[rightAd.id] && (
              <FloatingCornerAd 
                ad={rightAd} 
                position="right" 
                onDismiss={handleCornerDismiss}
              />
            )}
          </AnimatePresence>

          {/* Fixed Bottom Banner */}
          {hasBottomBanner && (
            <FixedBottomBanner ads={bottomAds} />
          )}
        </>
      )}

    </div>
  );
};

export default DashboardLayout;
