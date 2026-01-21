import { Users, BookOpen, GraduationCap, Trophy } from "lucide-react";

const STATS = [
  { icon: Users, value: "50k+", label: "Active Students", color: "orange", borderColor: "border-primary" },
  { icon: BookOpen, value: "1.2k+", label: "Study Materials", color: "blue", borderColor: "border-secondary" },
  { icon: GraduationCap, value: "95%", label: "Success Rate", color: "green", borderColor: "border-green-500" },
  { icon: Trophy, value: "500+", label: "Top Rankers", color: "purple", borderColor: "border-purple-500" },
];

const COLOR_MAP = {
  orange: { bg: "bg-orange-50", text: "text-orange-500" },
  blue: { bg: "bg-blue-50", text: "text-secondary" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
};

export default function StatsSection() {
  return (
    <section className="relative -mt-20 z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {STATS.map((stat, index) => {
          const colors = COLOR_MAP[stat.color];
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-b-4 ${stat.borderColor} text-center group transform hover:-translate-y-1`}
            >
              <div className={`w-14 h-14 mx-auto ${colors.bg} rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner`}>
                <Icon className={`w-7 h-7 ${colors.text}`} />
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}