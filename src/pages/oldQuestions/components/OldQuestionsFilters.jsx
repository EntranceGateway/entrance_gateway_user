import { UNIVERSITIES } from "../../../constants/universities";

const COURSES = [
  { value: "", label: "Course (All)" },
  { value: "BCA", label: "BCA" },
  { value: "CSIT", label: "BSc. CSIT" },
  { value: "BIT", label: "BIT" },
  { value: "BIM", label: "BIM" },
];

const YEARS = [
  { value: "", label: "Year (All)" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
  { value: "2019", label: "2019" },
];

const AFFILIATIONS = [
  { value: "", label: "Affiliation (All)" },
  ...UNIVERSITIES
];

export default function OldQuestionsFilters({
  searchQuery,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  selectedYear,
  onYearChange,
  selectedAffiliation,
  onAffiliationChange,
  onReset,
}) {
  const hasActiveFilters = searchQuery || selectedCourse || selectedYear || selectedAffiliation;

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-sm"
            placeholder="Search by set name or subject..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Course Select */}
        <div>
          <select
            className="w-full py-2 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-sm"
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
          >
            {COURSES.map((course) => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        <div>
          <select
            className="w-full py-2 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-sm"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
          >
            {YEARS.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        {/* Affiliation Select - Hidden on mobile, shown on larger screens */}
        <div className="hidden lg:block">
          <select
            className="w-full py-2 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-sm"
            value={selectedAffiliation}
            onChange={(e) => onAffiliationChange(e.target.value)}
          >
            {AFFILIATIONS.map((affiliation) => (
              <option key={affiliation.value} value={affiliation.value}>
                {affiliation.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-center">
          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium w-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Reset
          </button>
        </div>

        {/* Affiliation Select - Mobile only */}
        <div className="lg:hidden md:col-span-2">
          <select
            className="w-full py-2 border-gray-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-sm"
            value={selectedAffiliation}
            onChange={(e) => onAffiliationChange(e.target.value)}
          >
            {AFFILIATIONS.map((affiliation) => (
              <option key={affiliation.value} value={affiliation.value}>
                {affiliation.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
