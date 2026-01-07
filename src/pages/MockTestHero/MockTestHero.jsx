import { motion } from "framer-motion";
import { Clock, BarChart3, Trophy, Zap } from "lucide-react";

export default function MockTestHero() {
  const features = [
    { icon: Clock, text: "Real-Time Timed Tests" },
    { icon: Zap, text: "Instant Scoring & Results" },
    { icon: BarChart3, text: "Detailed Performance Analytics" },
    { icon: Trophy, text: "Accurate Rank Prediction" },
  ];

  return (
    <section className="min-h-screen flex items-center bg-linear-to-br from-blue-600 via-indigo-700 to-blue-800 px-6 relative overflow-hidden">
      {/* Subtle background overlay for depth */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight"
          >
            Ace Your
            <br />
            Mock Tests
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-xl text-white/80 font-light max-w-xl"
          >
            Practice with authentic exam-pattern tests, receive instant detailed feedback, and improve with precise analytics.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-5"
          >
            <button className="px-8 py-4 bg-white text-indigo-700 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Start Mock Test
            </button>

            <button className="px-8 py-4 border-2 border-white/60 text-white font-semibold text-lg rounded-xl backdrop-blur-sm hover:bg-white/10 hover:border-white transition-all duration-300">
              Try Free Demo
            </button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <feature.icon className="w-6 h-6 text-white/70" />
                <span className="text-white/90 font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex justify-center lg:justify-end"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Sample Mock Test</h3>
              <span className="px-4 py-2 bg-white/20 text-white/90 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            <div className="space-y-5 text-white/80">
              <div className="flex justify-between">
                <span className="font-medium">Duration</span>
                <span>3 Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Questions</span>
                <span>90 Questions</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Subjects</span>
                <span>Physics, Chemistry, Maths</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Marks</span>
                <span>300</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-center text-white/70 text-sm">
                Thousands of students trust our mock tests for exam success
              </p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}