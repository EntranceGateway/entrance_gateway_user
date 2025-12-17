'use client';

import { motion } from 'framer-motion';
import AdCard from "../components/common/Adcard/Adcard";
import Card from "../components/common/Card";
import AdsPanel from "../components/layout/AdsPanel";
import DashboardLayout from "../components/layout/DashboardLayout";
import CoursesSection from './notes/course/CoursesSection';
import MockTestHero from './MockTestHero/MockTestHero';
import Colleges from './Colleges/Colleges';

const Dashboard = ({ showAds = false, show = true }) => {
  return (
    <DashboardLayout>
      <div className="flex flex-1 w-full">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-6 flex gap-6">
          <main className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${showAds ? "flex-1" : "w-full"}`}>
            
            {show && (
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
                          <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl flex-shrink-0 
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
            <MockTestHero />
            <Colleges/>
          </main>

          {showAds && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <AdsPanel />
            </aside>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;