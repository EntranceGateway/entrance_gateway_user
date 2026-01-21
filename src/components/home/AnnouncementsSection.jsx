import { ArrowRight } from "lucide-react";

export default function AnnouncementsSection({ ads = [] }) {
  const displayAds = ads.length > 0 ? ads.slice(0, 2) : [
    { id: 1, type: "Featured", title: "Limited Time Offer: Complete Physics Bundle for CEE", subtitle: "Valid until Feb 28", cta: "Claim Offer", bgColor: "blue" },
    { id: 2, type: "Alert", title: "Admissions Open – BCA 2026 Batch Application", subtitle: "Early bird registration", cta: "Apply Now", bgColor: "orange" },
  ];

  const getBgClass = (color) => {
    if (color === "blue") return "bg-blue-50";
    if (color === "orange") return "bg-orange-50";
    return "bg-blue-50";
  };

  const getBadgeClass = (color) => {
    if (color === "blue") return "bg-blue-100 text-blue-700";
    if (color === "orange") return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid md:grid-cols-2 gap-8">
        {displayAds.map((ad) => (
          <div
            key={ad.id}
            className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${getBgClass(ad.bgColor)} rounded-bl-[4rem] -mr-4 -mt-4 z-0 group-hover:scale-110 transition-transform`} />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getBadgeClass(ad.bgColor)}`}>
                {ad.type || "Featured"}
              </span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 relative z-10">
              {ad.title}
            </h4>
            <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100 relative z-10">
              <span className="text-sm text-gray-500 font-medium">{ad.subtitle}</span>
              <button className="text-sm font-bold text-accent flex items-center gap-2 group-hover:gap-3 transition-all">
                {ad.cta || "Learn More"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}