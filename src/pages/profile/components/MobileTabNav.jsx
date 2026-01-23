export default function MobileTabNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "profile", label: "Profile", icon: "account_circle" },
    { id: "edit", label: "Edit", icon: "edit_square" },
    { id: "security", label: "Security", icon: "lock" },
  ];

  return (
    <div className="md:hidden sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm mb-6">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-semibold transition-all relative ${
              activeTab === tab.id
                ? "text-brand-blue"
                : "text-gray-500"
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${
              activeTab === tab.id ? "fill-1" : ""
            }`}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
