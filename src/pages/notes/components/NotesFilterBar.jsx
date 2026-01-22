export default function NotesFilterBar({ 
  searchQuery, 
  onSearchChange, 
  selectedCourse, 
  onCourseChange,
  selectedYear,
  onYearChange,
  selectedSemester,
  onSemesterChange,
  selectedAffiliation,
  onAffiliationChange,
  onFilter,
  courses = [],
  affiliations = []
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-sm">
      <form className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-3 relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm transition-all outline-none text-gray-700 placeholder-gray-400"
            placeholder="Search by note name or subject code..."
          />
        </div>

        {/* Course Select */}
        <div className="md:col-span-2">
          <select
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="w-full py-2.5 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-gray-700 outline-none cursor-pointer"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Select */}
        <div className="md:col-span-2">
          <select
            value={selectedSemester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="w-full py-2.5 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-gray-700 outline-none cursor-pointer"
          >
            <option value="">All Semesters</option>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
            <option value="3">3rd Semester</option>
            <option value="4">4th Semester</option>
            <option value="5">5th Semester</option>
            <option value="6">6th Semester</option>
            <option value="7">7th Semester</option>
            <option value="8">8th Semester</option>
          </select>
        </div>

        {/* Affiliation Select */}
        <div className="md:col-span-3">
          <select
            value={selectedAffiliation}
            onChange={(e) => onAffiliationChange(e.target.value)}
            className="w-full py-2.5 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm text-gray-700 outline-none cursor-pointer"
          >
            <option value="">All Universities</option>
            {affiliations.map((affiliation) => (
              <option key={affiliation.value} value={affiliation.value}>
                {affiliation.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Button */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={onFilter}
            className="w-full h-full py-2.5 bg-brand-navy hover:bg-brand-blue text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filter Results
          </button>
        </div>
      </form>
    </div>
  );
}
