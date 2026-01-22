export default function SyllabusInfoCard({ syllabus }) {
  const infoItems = [
    {
      icon: "fingerprint",
      label: "Course Code",
      value: syllabus.courseCode || "N/A",
    },
    {
      icon: "schedule",
      label: "Credit Hours",
      value: `${syllabus.creditHours || 3} Credit Hours`,
    },
    {
      icon: "school",
      label: "Program",
      value: syllabus.courseName || "N/A",
    },
    {
      icon: "calendar_today",
      label: "Semester",
      value: `${syllabus.semester || 1}${getSemesterSuffix(syllabus.semester)} Semester`,
    },
    {
      icon: "schedule",
      label: "Lecture Hours",
      value: `${syllabus.lectureHours || 0} Hours`,
    },
    {
      icon: "science",
      label: "Practical Hours",
      value: `${syllabus.practicalHours || 0} Hours`,
    },
  ];

  return (
    <div className="lg:sticky lg:top-24 space-y-4 md:space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 md:px-5 py-3 md:py-4 border-b border-gray-200">
          <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-gray-600">
            Subject Information
          </h3>
        </div>
        
        {/* Mobile: Grid Layout, Desktop: List Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-px bg-gray-100 lg:bg-transparent lg:divide-y lg:divide-gray-100">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="bg-white px-3 md:px-4 lg:px-5 py-3 md:py-4 group hover:bg-gray-50 transition-colors"
            >
              <p className="text-gray-500 text-xs font-medium mb-1">
                {item.label}
              </p>
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="material-icons-round text-brand-gold text-base md:text-lg">
                  {item.icon}
                </span>
                <p className="text-brand-navy text-xs md:text-sm font-medium truncate">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Helper Card - Hidden on mobile */}
      <div className="hidden md:block bg-brand-gold/10 rounded-xl p-4 md:p-5 border border-brand-gold/20">
        <div className="flex items-start gap-3">
          <span className="material-icons-round text-brand-gold mt-0.5">
            lightbulb
          </span>
          <div>
            <h4 className="font-bold text-brand-navy text-sm">Study Tip</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Review the course objectives and learning outcomes before diving into the detailed syllabus content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSemesterSuffix(semester) {
  if (!semester) return "1st";
  const num = parseInt(semester);
  if (num === 1) return "st";
  if (num === 2) return "nd";
  if (num === 3) return "rd";
  return "th";
}
