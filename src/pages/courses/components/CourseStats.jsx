const COURSE_TYPE_LABELS = {
  SEMESTER: 'Semester System',
  ANNUAL: 'Annual System',
  TRIMESTER: 'Trimester System',
};

export function CourseStats({ course }) {
  const typeLabel = COURSE_TYPE_LABELS[course?.courseType] || course?.courseType || 'Standard';
  
  const stats = [
    {
      icon: 'calendar_month',
      label: 'Duration',
      value: course?.duration || '4 Years',
    },
    {
      icon: 'school',
      label: 'Type',
      value: typeLabel,
    },
    {
      icon: 'language',
      label: 'Medium',
      value: course?.medium || 'English / Nepali',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm">
      <h3 className="text-base sm:text-lg font-bold text-brand-navy mb-5 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
        Course Stats
      </h3>
      
      <div className="space-y-4 sm:space-y-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue flex-shrink-0">
              <span className="material-icons-round text-xl sm:text-2xl">{stat.icon}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {stat.label}
              </span>
              <span className="font-bold text-gray-900 text-base sm:text-lg truncate block">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
