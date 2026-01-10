import { useState, useEffect } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import AdsPanel from "./AdsPanel";
import { getAds, filterAdsByPosition, AD_POSITIONS } from "../../http/ads";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import axios from "axios";

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

/**
 * Utility to get ad image URL (handles auth for protected images)
 */
const getAdImageUrl = async (imageNameOrUrl) => {
  if (!imageNameOrUrl) return null;
  // If it's a full URL, return as is
  if (/^https?:\/\//.test(imageNameOrUrl)) return imageNameOrUrl;
  // Otherwise, fetch with auth
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `https://api.entrancegateway.com/${imageNameOrUrl}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );
    return URL.createObjectURL(response.data);
  } catch (err) {
    console.error("Failed to fetch ad image", err);
    return null;
  }
};

/**
 * Fixed Bottom Banner for Vertical Ads - Professional Full-Width Style
 * Features: Auto-rotation, image fallback, priority indicator, smooth animations
 * Similar to Google Ads / Professional Ad Networks
 */
const VerticalAdsBottomBanner = ({ ads = [] }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Auto-rotate ads every 6 seconds (pause on hover)
  useEffect(() => {
    if (ads.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      setImageError(false);
    }, 6000);
    return () => clearInterval(interval);
  }, [ads.length, isHovered]);

  const currentAd = ads[currentAdIndex];

  useEffect(() => {
    let isMounted = true;
    setImageUrl(null);
    setImageError(false);
    if (!currentAd) return;
    // Always use the raw image field (not normalized URL)
    (async () => {
      // Prefer images[0] if available, else image, imageUrl, bannerImage
      let rawImage = null;
      if (Array.isArray(currentAd.images) && currentAd.images.length > 0) {
        rawImage = currentAd.images[0];
      } else if (currentAd.image) {
        rawImage = currentAd.image;
      } else if (currentAd.imageUrl) {
        rawImage = currentAd.imageUrl;
      } else if (currentAd.bannerImage) {
        rawImage = currentAd.bannerImage;
      }
      const url = await getAdImageUrl(rawImage);
      if (isMounted) setImageUrl(url);
    })();
    return () => { isMounted = false; };
  }, [currentAd]);

  if (!currentAd || !isVisible) return null;

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  const goToPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
    setImageError(false);
  };
  
  const goToNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    setImageError(false);
  };
  
  // Priority colors for badge
  const priorityColors = {
    HIGH: "from-red-500 to-rose-600",
    MEDIUM: "from-orange-500 to-amber-600",
    LOW: "from-blue-500 to-indigo-600",
    CRITICAL: "from-purple-500 to-violet-600",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Banner Container - Full Width with Gradient Background */}
        <div className="w-full bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 shadow-[0_-4px_30px_rgba(0,0,0,0.4)]">
          <div className="relative max-w-7xl mx-auto">
            
            {/* Close Button - Elegant Circle */}
            <button
              onClick={handleDismiss}
              className="absolute top-1/2 -translate-y-1/2 right-3 z-30 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all group border border-white/10"
              title="Close ad"
            >
              <X className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
            </button>

            {/* Ad Label & Counter */}
            <div className="absolute top-2 left-4 z-20 flex items-center gap-2">
              <span className="text-[10px] font-medium text-white/80 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Ad • {currentAdIndex + 1} of {ads.length}
              </span>
              {currentAd.priority && (
                <span className={`text-[10px] font-semibold text-white bg-linear-to-r ${priorityColors[currentAd.priority] || "from-gray-500 to-gray-600"} px-2 py-1 rounded-full`}>
                  {currentAd.priority}
                </span>
              )}
            </div>

            {/* Banner Content - Link Wrapper */}
            <a 
              href={currentAd.redirectUrl || currentAd.linkUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex items-stretch min-h-20">
                
                {/* Left: Ad Image with Hover Effect */}
                <div className="hidden sm:block w-48 md:w-64 lg:w-80 shrink-0 relative overflow-hidden">
                  {!imageError && imageUrl ? (
                    <motion.img 
                      src={imageUrl} 
                      alt={currentAd.title}
                      className="w-full h-full object-cover"
                      animate={{ scale: isHovered ? 1.05 : 1 }}
                      transition={{ duration: 0.4 }}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-white font-bold text-3xl">EG</span>
                        <p className="text-white/70 text-[10px]">Entrance Gateway</p>
                      </div>
                    </div>
                  )}
                  {/* Gradient overlay for smooth transition */}
                  <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-gray-900 to-transparent" />
                </div>

                {/* Mobile: Small Logo */}
                <div className="sm:hidden flex items-center justify-center w-16 bg-linear-to-br from-orange-500 to-amber-600">
                  <span className="text-white font-bold text-xl">EG</span>
                </div>

                {/* Center: Text Content */}
                <div className="flex-1 flex items-center px-4 sm:px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <motion.h4 
                      className="text-white font-bold text-sm sm:text-lg md:text-xl leading-tight mb-1 line-clamp-1 group-hover:text-orange-300 transition-colors"
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentAd.title}
                    </motion.h4>
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-1 hidden sm:block">
                      {currentAd.bannerName || currentAd.description || "Special offer - Click to learn more"}
                    </p>
                  </div>
                </div>

                {/* Right: CTA Button with Glow Effect */}
                <div className="flex items-center pr-14 sm:pr-16 pl-2">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center gap-2 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Learn More</span>
                    <span className="sm:hidden">View</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </a>

            {/* Navigation Arrows - Only if multiple ads */}
            {ads.length > 1 && (
              <>
                <button 
                  onClick={goToPrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/70 hover:text-white rounded-full transition-all border border-white/10"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  onClick={goToNext}
                  className="absolute right-12 sm:right-14 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/70 hover:text-white rounded-full transition-all border border-white/10"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

            {/* Progress Bar - Animated with Current Ad Highlight */}
            {ads.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50 flex overflow-hidden">
                {ads.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={(e) => { e.preventDefault(); setCurrentAdIndex(idx); setImageError(false); }}
                    className="flex-1 h-full relative overflow-hidden"
                  >
                    <motion.div 
                      className={`absolute inset-0 ${idx === currentAdIndex ? "bg-linear-to-r from-orange-400 to-orange-600" : "bg-gray-700 hover:bg-gray-600"}`}
                      initial={false}
                      animate={{ 
                        scaleX: idx === currentAdIndex ? 1 : 1,
                        opacity: idx === currentAdIndex ? 1 : 0.5
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const DashboardLayout = ({ 
  children, 
  showAds = false,  // Sidebar ads panel disabled by default
  showFloatingAds = true,  // Show floating ads by default on all pages
  showBottomPadding = true
}) => {
  const [allAds, setAllAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        const ads = await getAds({ page: 0, size: 20 });
        setAllAds(ads);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
        setAllAds([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (showFloatingAds) fetchAds();
  }, [showFloatingAds]);

  // Get vertical ads for bottom banner
  const verticalAds1 = filterAdsByPosition(allAds, AD_POSITIONS.VERTICAL_1);
  const verticalAds2 = filterAdsByPosition(allAds, AD_POSITIONS.VERTICAL_2);
  const verticalAds3 = filterAdsByPosition(allAds, AD_POSITIONS.VERTICAL_3);
  const verticalAds4 = filterAdsByPosition(allAds, AD_POSITIONS.VERTICAL_4);
  const allVerticalAds = [...verticalAds1, ...verticalAds2, ...verticalAds3, ...verticalAds4];
  
  // Floating bottom ads - prefer dedicated floating bottom, then vertical ads, then any ads
  const floatingBottomAds = filterAdsByPosition(allAds, AD_POSITIONS.FLOATING_BOTTOM);
  const bottomBannerAds = floatingBottomAds.length > 0 
    ? floatingBottomAds 
    : allVerticalAds.length > 0 
      ? allVerticalAds 
      : allAds.length > 0 
        ? allAds.slice(0, 4) 
        : [];
  
  const hasBottomBanner = showFloatingAds && bottomBannerAds.length > 0;

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
      <div className={`w-full box-border ${showBottomPadding ? 'pb-16' : ''}`}>
        <Footer />
      </div>

      {/* FLOATING BOTTOM BANNER - Shows on all pages */}
      {showFloatingAds && hasBottomBanner && (
        <VerticalAdsBottomBanner ads={bottomBannerAds} />
      )}

    </div>
  );
};

export default DashboardLayout;
