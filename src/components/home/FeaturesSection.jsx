import { BookOpen, Target, Building2, Trophy } from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Exam-Focused Materials",
    description: "Syllabus-based notes and model questions designed specifically for Nepalese entrance exams.",
    color: "blue",
    hoverBorder: "hover:border-blue-100",
  },
  {
    icon: Target,
    title: "Guided Strategy",
    description: "Follow mentor-approved study plans aligned with real exam patterns and difficulty levels.",
    color: "red",
    hoverBorder: "hover:border-red-100",
  },
  {
    icon: Building2,
    title: "College Insights",
    description: "Compare colleges, cut-offs, fees, and admission trends before choosing your path.",
    color: "green",
    hoverBorder: "hover:border-green-100",
  },
  {
    icon: Trophy,
    title: "Result-Oriented",
    description: "Everything is optimized for accuracy, speed, and rank improvement — not theory overload.",
    color: "orange",
    hoverBorder: "hover:border-orange-100",
  },
];

const COLOR_MAP = {
  blue: { bg: "bg-blue-50", text: "text-secondary" },
  red: { bg: "bg-red-50", text: "text-red-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
};

const ABOUT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuB_o0wEgb8t4PymNWYnZd9x7vXfil09hv9AMu1d7eziRyzqK264VCPInuS8SikrNpq4XMIrxIg1Gj6KEKmc3Z4NsJeV9knHATJaAUHGApq2CTX8HfmiBfbwDKOYvBGVlgMc_HUtKOYBmUpnQytECPUxnbXGImnW3WqemLnVafJkViep7F8mNKpZJrGR0vRGo_cHNAmQ8y8rICQYAOXjnnHhigqmVVg95giqRLFwdAf7AzJLAukdWrMPQ6zilT_tOQ4csVubo61cMNc";

export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-accent rounded-3xl transform rotate-3 opacity-10" />
            <div className="absolute inset-0 bg-primary rounded-3xl transform -rotate-2 opacity-10 scale-95" />
            <img
              alt="Student thinking"
              className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px] lg:h-[650px] border-4 border-white"
              src={ABOUT_IMAGE}
            />
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-3 block">Our Platform</span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Prepare Smarter for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-primary">Entrance Exams</span>
            </h2>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Entrance Gateways delivers exam-focused preparation with structured resources, expert strategies, and real admission insights.
            </p>

            <div className="grid gap-6">
              {FEATURES.map((feature, index) => {
                const colors = COLOR_MAP[feature.color];
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`group flex gap-5 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg ${feature.hoverBorder} transition-all`}
                  >
                    <div className={`flex-shrink-0 w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}