'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Users, Trophy, ArrowRight, Star, TrendingUp, CheckCircle } from 'lucide-react';
import AdCard from "../components/common/Adcard/Adcard";
import Card from "../components/common/Card";
import AdsPanel from "../components/layout/AdsPanel";
import DashboardLayout from "../components/layout/DashboardLayout";
import CoursesSection from './notes/course/CoursesSection';
import MockTestHero from './MockTestHero/MockTestHero';
import Colleges from './Colleges/Colleges';
import { getAds, AD_POSITIONS, filterAdsByPosition } from "../http/ads";

// Stats data
const stats = [
  { icon: Users, value: "50,000+", label: "Active Students", color: "orange" },
  { icon: BookOpen, value: "1,200+", label: "Study Materials", color: "blue" },
  { icon: GraduationCap, value: "95%", label: "Success Rate", color: "green" },
  { icon: Trophy, value: "500+", label: "Top Rankers", color: "purple" },
];

const Dashboard = ({ showAds = false, show = true }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement within hero section
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Fetch ads on mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await getAds();
        setAds(data);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Helper to get ads by position
  const getAdsByPos = (position) => filterAdsByPosition(ads, position);

  // Horizontal ads (for grid display)
  const horizontalAds1 = getAdsByPos(AD_POSITIONS.HORIZONTAL_1);
  const horizontalAds2 = getAdsByPos(AD_POSITIONS.HORIZONTAL_2);
  const horizontalAds3 = getAdsByPos(AD_POSITIONS.HORIZONTAL_3);

  // Vertical ads (for sidebar)
  const verticalAds1 = getAdsByPos(AD_POSITIONS.VERTICAL_1);
  const verticalAds2 = getAdsByPos(AD_POSITIONS.VERTICAL_2);
  const verticalAds3 = getAdsByPos(AD_POSITIONS.VERTICAL_3);
  const verticalAds4 = getAdsByPos(AD_POSITIONS.VERTICAL_4);

  return (
    <DashboardLayout>
      <div className="flex flex-1 w-full">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-0 flex gap-6">
          <main className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${showAds ? "flex-1" : "w-full"}`}>
            
            {/* Hero Section - New Professional Design */}
            <motion.section
              ref={heroRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative bg-linear-to-br from-orange-600 via-orange-500 to-amber-500 rounded-3xl overflow-hidden mb-12 -mx-6 md:-mx-8 -mt-6 md:-mt-8"
            >
              {/* Interactive Background Bubbles */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <motion.div
                  className="absolute w-72 h-72 bg-white rounded-full"
                  style={{
                    top: '-10%',
                    left: '-5%',
                  }}
                  animate={{
                    x: mousePosition.x * 40,
                    y: mousePosition.y * 40,
                  }}
                  transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                />
                <motion.div
                  className="absolute w-96 h-96 bg-white rounded-full"
                  style={{
                    bottom: '-15%',
                    right: '-10%',
                  }}
                  animate={{
                    x: mousePosition.x * -60,
                    y: mousePosition.y * -60,
                  }}
                  transition={{ type: 'spring', stiffness: 40, damping: 25 }}
                />
                <motion.div
                  className="absolute w-64 h-64 bg-white rounded-full"
                  style={{
                    top: '40%',
                    left: '45%',
                  }}
                  animate={{
                    x: mousePosition.x * 30,
                    y: mousePosition.y * 30,
                  }}
                  transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                />
                <motion.div
                  className="absolute w-48 h-48 bg-white rounded-full"
                  style={{
                    top: '20%',
                    right: '20%',
                  }}
                  animate={{
                    x: mousePosition.x * -50,
                    y: mousePosition.y * 50,
                  }}
                  transition={{ type: 'spring', stiffness: 45, damping: 20 }}
                />
                <motion.div
                  className="absolute w-32 h-32 bg-white rounded-full"
                  style={{
                    bottom: '30%',
                    left: '15%',
                  }}
                  animate={{
                    x: mousePosition.x * 70,
                    y: mousePosition.y * -40,
                  }}
                  transition={{ type: 'spring', stiffness: 55, damping: 18 }}
                />
              </div>

              <div className="relative z-10 px-6 md:px-12 py-16 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                      <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                      <span className="text-white text-sm font-medium">Nepal's #1 Entrance Preparation Platform</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                      Crack Your <br />
                      <span className="text-yellow-300">Entrance Exam</span> <br />
                      With Confidence
                    </h1>

                    <p className="text-white/90 text-lg md:text-xl max-w-lg mb-8">
                      Join thousands of successful students who transformed their preparation with our comprehensive study materials, mock tests, and expert guidance.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                      >
                        Start Learning
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <Link
                        to="/notes"
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all border border-white/30"
                      >
                        Browse Notes
                      </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center gap-6 mt-10">
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-orange-300 flex items-center justify-center text-xs font-bold text-orange-800">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <div className="text-white">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                          ))}
                        </div>
                        <p className="text-sm text-white/80">Trusted by 50,000+ students</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Image */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative hidden lg:block"
                  >
                    <div className="relative">
                      <img
                        src="https://i.pinimg.com/1200x/09/13/5a/09135af87cbb85c5689c1f9bda18c20e.jpg"
                        alt="Students studying"
                        className="w-full h-[450px] object-cover rounded-2xl shadow-2xl"
                      />
                      {/* Floating Cards */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="absolute -left-8 top-1/4 bg-white rounded-xl p-4 shadow-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">95%</p>
                            <p className="text-sm text-gray-500">Success Rate</p>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="absolute -right-4 bottom-1/4 bg-white rounded-xl p-4 shadow-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">1200+</p>
                            <p className="text-sm text-gray-500">Study Materials</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`relative overflow-hidden bg-white border-2 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all
                    ${stat.color === 'orange' ? 'border-orange-100 hover:border-orange-200' : ''}
                    ${stat.color === 'blue' ? 'border-blue-100 hover:border-blue-200' : ''}
                    ${stat.color === 'green' ? 'border-green-100 hover:border-green-200' : ''}
                    ${stat.color === 'purple' ? 'border-purple-100 hover:border-purple-200' : ''}
                  `}
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4
                    ${stat.color === 'orange' ? 'bg-orange-100' : ''}
                    ${stat.color === 'blue' ? 'bg-blue-100' : ''}
                    ${stat.color === 'green' ? 'bg-green-100' : ''}
                    ${stat.color === 'purple' ? 'bg-purple-100' : ''}
                  `}>
                    <stat.icon className={`w-7 h-7
                      ${stat.color === 'orange' ? 'text-orange-600' : ''}
                      ${stat.color === 'blue' ? 'text-blue-600' : ''}
                      ${stat.color === 'green' ? 'text-green-600' : ''}
                      ${stat.color === 'purple' ? 'text-purple-600' : ''}
                    `} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-500 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Horizontal Ads Row 1 - Dynamic from API */}
            {horizontalAds1.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              >
                {horizontalAds1.map((ad) => (
                  <AdCard 
                    key={ad.id || ad.adId} 
                    title={ad.title} 
                    banner={ad.bannerUrl || ad.imageUrl} 
                    bannerUrl={ad.redirectUrl || ad.linkUrl || "#"} 
                    badge={ad.bannerName || "Sponsored"}
                  />
                ))}
              </motion.div>
            )}
            
            {/* Fallback static ads if no API ads */}
            {show && horizontalAds1.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              >
                <AdCard title="Limited Time: 50% Off First Month!" banner="https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA" bannerUrl="https://youtu.be/me8guS2gYyI?si=YCEz3i-w96pUBdBj" />
                <Card title="Join Thousands of Successful Students" banner="https://i.pinimg.com/736x/09/47/db/0947db859f8bbec51f4f85d030c59b03.jpg" bannerUrl="https://youtu.be/me8guS2gYyI?si=YCEz3i-w96pUBdBj" />
                <AdCard title="Enroll Now & Secure Your Rank!" banner="https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA" bannerUrl="https://youtu.be/me8guS2gYyI?si=YCEz3i-w96pUBdBj" />
                <Card title="Master Entrance with Confidence" banner="https://i.pinimg.com/736x/09/47/db/0947db859f8bbec51f4f85d030c59b03.jpg" bannerUrl="https://youtu.be/me8guS2gYyI?si=YCEz3i-w96pUBdBj" />
              </motion.div>
            )}

            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-white to-orange-50 py-16 lg:py-24 rounded-3xl -mx-6 md:-mx-8 px-6 md:px-8 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto h-full">
                {/* REMOVED 'items-center' so columns stretch to equal height */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:h-full">
                  
                  {/* Left Side: Image (Covers Full Height) */}
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-full h-full order-2 lg:order-1 min-h-[400px]" 
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src="https://i.pinimg.com/1200x/09/13/5a/09135af87cbb85c5689c1f9bda18c20e.jpg"
                        alt="Nepali students preparing for entrance exams"
                        className="w-full h-full object-cover" 
                        loading="eager"
                      />
                    </div>
                  </motion.div>

                  {/* Right Side: Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="order-1 lg:order-2 flex flex-col justify-center"
                  >
                    <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
                      Our Platform
                    </span>

                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                      Prepare Smarter for <br />
                      <span className="text-orange-500">Entrance Exams in Nepal</span>
                    </h2>

                    <p className="mt-6 text-lg text-gray-600 max-w-xl">
                      <b>Entrance Gateways</b> delivers exam-focused preparation with structured resources, 
                      expert strategies, and real admission insights.
                    </p>

                    <div className="mt-10 space-y-6">
                      {[
                        { icon: "📘", color: "orange", title: "Exam-Focused Study Materials", desc: "Syllabus-based notes, model questions, and practice tests designed for Nepalese entrance exams." },
                        { icon: "🎯", color: "blue", title: "Guided Preparation Strategy", desc: "Follow mentor-approved study plans aligned with real exam patterns and difficulty levels." },
                        { icon: "🏫", color: "green", title: "College & Course Insights", desc: "Compare colleges, cut-offs, fees, and admission trends before choosing your path." },
                        { icon: "🏆", color: "red", title: "Result-Oriented Learning", desc: "Everything is optimized for accuracy, speed, and rank improvement — not theory overload." },
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="flex gap-4 bg-white/70 backdrop-blur p-6 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                        >
                          <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl shrink-0 
                            ${feature.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
                            ${feature.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                            ${feature.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                            ${feature.color === 'red' ? 'bg-red-100 text-red-600' : ''}
                          `}>
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {feature.title}
                            </h3>
                            <p className="mt-1 text-gray-600">
                              {feature.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
            <CoursesSection/>
            
            {/* Horizontal Ads Row 2 - Between sections */}
            {horizontalAds2.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12"
              >
                {horizontalAds2.map((ad) => (
                  <AdCard 
                    key={ad.id || ad.adId} 
                    title={ad.title} 
                    banner={ad.bannerUrl || ad.imageUrl} 
                    bannerUrl={ad.redirectUrl || ad.linkUrl || "#"} 
                    badge={ad.bannerName || "Sponsored"}
                  />
                ))}
              </motion.div>
            )}
            
            <MockTestHero />
            
            {/* Horizontal Ads Row 3 - Before Colleges */}
            {horizontalAds3.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12"
              >
                {horizontalAds3.map((ad) => (
                  <AdCard 
                    key={ad.id || ad.adId} 
                    title={ad.title} 
                    banner={ad.bannerUrl || ad.imageUrl} 
                    bannerUrl={ad.redirectUrl || ad.linkUrl || "#"} 
                    badge={ad.bannerName || "Sponsored"}
                  />
                ))}
              </motion.div>
            )}
            
            <Colleges/>
          </main>

          {/* Sidebar with Vertical Ads */}
          {showAds && (
            <aside className="hidden lg:block w-80 shrink-0 space-y-6">
              {/* Vertical Ad Position 1 */}
              {verticalAds1.length > 0 && verticalAds1.map((ad) => (
                <div key={ad.id || ad.adId} className="sticky top-4">
                  <AdCard 
                    title={ad.title} 
                    banner={ad.bannerUrl || ad.imageUrl} 
                    bannerUrl={ad.redirectUrl || ad.linkUrl || "#"} 
                    badge={ad.bannerName || "Sponsored"}
                  />
                </div>
              ))}
              
              {/* Vertical Ad Position 2 */}
              {verticalAds2.length > 0 && verticalAds2.map((ad) => (
                <AdCard 
                  key={ad.id || ad.adId} 
                  title={ad.title} 
                  banner={ad.bannerUrl || ad.imageUrl} 
                  bannerUrl={ad.redirectUrl || ad.linkUrl || "#"} 
                  badge={ad.bannerName || "Sponsored"}
                />
              ))}
              
              {/* Vertical Ad Position 3 */}
              {verticalAds3.length > 0 && verticalAds3.map((ad) => (
                <AdCard 
                  key={ad.id || ad.adId} 
                  title={ad.title} 
                  banner={ad.bannerUrl || ad.imageUrl} 
                  bannerUrl={ad.redirectUrl || ad.linkUrl || "#"} 
                  badge={ad.bannerName || "Sponsored"}
                />
              ))}
              
              {/* Vertical Ad Position 4 */}
              {verticalAds4.length > 0 && verticalAds4.map((ad) => (
                <AdCard 
                  key={ad.id || ad.adId} 
                  title={ad.title} 
                  banner={ad.bannerUrl || ad.imageUrl} 
                  bannerUrl={ad.redirectUrl || ad.linkUrl || "#"} 
                  badge={ad.bannerName || "Sponsored"}
                />
              ))}
              
              {/* Fallback if no vertical ads */}
              {verticalAds1.length === 0 && verticalAds2.length === 0 && 
               verticalAds3.length === 0 && verticalAds4.length === 0 && (
                <AdsPanel />
              )}
            </aside>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;