import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { HeroSection, StatsSection, AnnouncementsSection, FeaturesSection, FloatingNotification } from "../components/home";
import CoursesSection from "./notes/course/CoursesSection";
import MockTestHero from "./MockTestHero/MockTestHero";
import Colleges from "./Colleges/Colleges";
import AdCard from "../components/common/Adcard/Adcard";
import { getAds, AD_POSITIONS, filterAdsByPosition } from "../http/ads";

const FloatingCornerAd = ({ ad, position = "right" }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!ad || !isVisible) return null;

  const handleClose = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsVisible(false);
  };

  const positionClasses = position === "left" ? "left-4 bottom-24" : "right-4 bottom-24";

  return (
    <div className={`fixed ${positionClasses} z-40 hidden lg:block`}>
      <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden hover:-translate-y-1 transition-transform">
        <button onClick={handleClose} className="absolute top-3 right-3 z-20 p-1.5 bg-white/90 hover:bg-red-50 rounded-full transition-all shadow-md group" title="Close">
          <X className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
        </button>
        <a href={ad.redirectUrl || ad.linkUrl || "#"} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative h-40 overflow-hidden">
            {!imageError && (ad.imageUrl || ad.bannerUrl) ? (
              <img src={ad.imageUrl || ad.bannerUrl} alt={ad.title} className="w-full h-full object-cover" onError={() => setImageError(true)} />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-white font-bold text-4xl">EG</span>
                  <p className="text-white/80 text-xs mt-1">Entrance Gateway</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="text-[10px] font-semibold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Sponsored
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="font-bold text-white text-base leading-tight line-clamp-2 drop-shadow-lg">{ad.title}</h4>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-b from-white to-gray-50">
            <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-8">{ad.bannerName || ad.description || "Exclusive offer tailored for you. Click to discover more!"}</p>
            <div className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all shadow-lg">
              <span>Learn More</span>
              <ExternalLink className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              </span>
              Verified Partner
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await getAds({ page: 0, size: 20 });
        setAds(data);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const getAdsByPos = (position) => filterAdsByPosition(ads, position);
  const horizontalAds1 = getAdsByPos(AD_POSITIONS.HORIZONTAL_1);
  const horizontalAds2 = getAdsByPos(AD_POSITIONS.HORIZONTAL_2);
  const verticalAds = [...getAdsByPos(AD_POSITIONS.VERTICAL_1), ...getAdsByPos(AD_POSITIONS.VERTICAL_2)];
  const floatingRightAds = getAdsByPos(AD_POSITIONS.FLOATING_RIGHT);
  const cornerAd = floatingRightAds[0] || verticalAds[0] || ads[0];

  return (
    <DashboardLayout showFloatingAds={false} fullWidth={true}>
      <HeroSection />
      
      {/* Stats Section with proper spacing */}
      <div className="relative -mt-20 z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <StatsSection />
      </div>
      
      {/* Announcements Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <AnnouncementsSection ads={horizontalAds1} />
      </div>
      
      <FeaturesSection />
      
      {/* Courses Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CoursesSection />
        </div>
      </section>

      {/* Horizontal Ads Section */}
      {horizontalAds2.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {horizontalAds2.map((ad) => (
              <AdCard key={ad.id || ad.adId} title={ad.title} banner={ad.bannerUrl || ad.imageUrl} bannerUrl={ad.redirectUrl || ad.linkUrl || "#"} badge={ad.bannerName || "Sponsored"} />
            ))}
          </div>
        </section>
      )}

      <MockTestHero />
      <Colleges />
      
      {cornerAd && <FloatingCornerAd ad={cornerAd} position="right" />}
      <FloatingNotification title="New CEE Entrance Date!" message="The Medical Education Commission has updated the schedule. Click to view." />
    </DashboardLayout>
  );
};

export default Dashboard;