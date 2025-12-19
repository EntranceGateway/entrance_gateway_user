import { useMemo } from "react";

export default function FilterSidebar({
  universities = [],
  courses = [],
  selectedUniversities,
  setSelectedUniversities,
  selectedCourses,
  setSelectedCourses,
}) {
  // Extract unique course names (categories)
  const courseNames = useMemo(() => {
    return [...new Set(courses.map(c => c.name))].sort(); // Optional: sort alphabetically
  }, [courses]);

  const toggleSelection = (value, selectedList, setSelectedList) => {
    setSelectedList(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="sticky top-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-80">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Refine Search
        </h3>
      </div>

      <div className="p-6 space-y-10">
        {/* University Filter */}
        <section>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Universities</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 pr-2">
            {universities.map(university => (
              <FilterCheckbox
                key={university.label}
                label={university.label}
                count={university.count} // Optional: show count if available
                checked={selectedUniversities.includes(university.label)}
                onChange={() => toggleSelection(university.label, selectedUniversities, setSelectedUniversities)}
              />
            ))}
          </div>
        </section>

        {/* Course Category Filter */}
        <section>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Course Category</h4>
          <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 pr-2">
            {courseNames.map(name => (
              <FilterCheckbox
                key={name}
                label={name}
                checked={selectedCourses.includes(name)}
                onChange={() => toggleSelection(name, selectedCourses, setSelectedCourses)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Reusable FilterCheckbox Component
function FilterCheckbox({ label, checked, onChange, count }) {
  return (
    <label className="flex items-center group cursor-pointer select-none">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 bg-white transition-all checked:border-orange-600 checked:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-1"
        />
        <svg
          className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none inset-0 m-auto"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span
        className={`ml-3 text-sm transition-colors ${
          checked
            ? "text-slate-900 font-semibold"
            : "text-slate-600 group-hover:text-slate-800"
        }`}
      >
        {label}
        {count !== undefined && (
          <span className="ml-2 text-xs text-slate-500 font-normal">({count})</span>
        )}
      </span>
    </label>
  );
}

// Example static data
export const UNIVERSITIES = [
  { label: "Tribhuwan University" },
  { label: "Kathmandu University" },
  { label: "Pokhara University" },
  { label: "Purbanchal University" },
  // Add more as needed...
];