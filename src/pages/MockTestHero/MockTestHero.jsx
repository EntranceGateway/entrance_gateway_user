import { Link } from "react-router-dom";

export default function MockTestHero() {
  const features = [
    { icon: "schedule", text: "Real-Time Timed Tests" },
    { icon: "bolt", text: "Instant Scoring & Results" },
    { icon: "analytics", text: "Detailed Analytics" },
    { icon: "emoji_events", text: "Rank Prediction" },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-accent rounded-3xl overflow-hidden relative shadow-2xl">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary blur-3xl"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 p-10 lg:p-20 relative z-10 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h2 className="font-display text-4xl lg:text-6xl font-bold mb-6">
              Ace Your <br />
              <span className="text-primary">Mock Tests</span>
            </h2>
            
            <p className="text-blue-100 text-xl mb-10 leading-relaxed max-w-lg">
              Practice with authentic exam-pattern tests, receive instant detailed feedback, and improve with precise analytics. Join the ranks of top scorers today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/mock-tests"
                className="bg-primary text-accent font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg"
              >
                Start Mock Test
              </Link>
              <button className="bg-transparent border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
                Try Free Demo
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm font-medium text-blue-100">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="material-icons-round text-primary bg-white/10 p-1.5 rounded-full">
                    {feature.icon}
                  </span>
                  {feature.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Mock Test Card */}
          <div className="relative flex justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-white shadow-2xl w-full max-w-sm transform rotate-3 hover:rotate-0 transition-all duration-500">
              {/* Card Header */}
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <h3 className="text-2xl font-bold">Sample Mock Test</h3>
                <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                  Live
                </span>
              </div>

              {/* Test Details */}
              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-base">
                  <span className="text-blue-200">Duration</span>
                  <span className="font-bold">3 Hours</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-blue-200">Questions</span>
                  <span className="font-bold">90 Questions</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-blue-200">Subjects</span>
                  <span className="font-bold">Physics, Chemistry, Maths</span>
                </div>
                <div className="flex justify-between text-lg border-t border-white/10 pt-6">
                  <span className="text-blue-200">Total Marks</span>
                  <span className="font-display font-bold text-primary text-2xl">300</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full py-3 bg-white text-accent font-bold rounded-xl hover:bg-gray-100 transition-colors">
                Enter Exam Hall
              </button>

              {/* Footer Text */}
              <p className="text-xs text-center text-blue-300 opacity-70 mt-4">
                Thousands of students trust our mock tests
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}