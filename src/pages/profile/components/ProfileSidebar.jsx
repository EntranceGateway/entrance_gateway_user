export default function ProfileSidebar({ activeTab, onTabChange }) {
  const tabs = [
    { id: "profile", label: "Personal Profile", icon: "account_circle" },
    { id: "edit", label: "Edit Profile", icon: "edit_square" },
    { id: "security", label: "Security & Password", icon: "lock" },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      {/* Navigation Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-roboto font-bold text-brand-navy text-lg">
            Account Settings
          </h2>
        </div>
        <nav className="flex flex-col">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-brand-blue bg-blue-50 border-r-4 border-brand-blue"
                  : "text-gray-600 hover:bg-gray-50 hover:text-brand-navy"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Premium Badge */}
      <div className="mt-6 p-4 bg-brand-navy rounded-xl text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-brand-gold text-sm">
            verified
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider">
            Premium Access
          </span>
        </div>
        <p className="text-[11px] text-gray-300">
          Your profile is verified. You have access to all premium mock tests and resources.
        </p>
      </div>
    </aside>
  );
}
