import React, { useState, useEffect } from 'react';
import { getCourses } from '../../http/course';

// Static data
export const UNIVERSITIES = [
  { label: "Tribhuwan University", key: "TRIBHUVAN_UNIVERSITY" },
  { label: "Kathmandu University", key: "KATHMANDU_UNIVERSITY" },
  { label: "Pokhara University", key: "POKHARA_UNIVERSITY" },
  { label: "Purbanchal University", key: "PURWANCHAL_UNIVERSITY" },
  { label: "Lumbini University", key: "LUMBINI_UNIVERSITY" },
  { label: "Mid Western University", key: "MID_WESTERN_UNIVERSITY" },
  { label: "Far Western University", key: "FAR_WESTERN_UNIVERSITY" },
  { label: "Campus Affiliated to Foreign University", key: "CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY" },
];

export const SEMESTERS = [
  { label: "1st", key: 1 }, { label: "2nd", key: 2 }, { label: "3rd", key: 3 }, { label: "4th", key: 4 },
  { label: "5th", key: 5 }, { label: "6th", key: 6 }, { label: "7th", key: 7 }, { label: "8th", key: 8 },
];
export const PROVINCES = [
  { label: "Koshi Province", key: "KOSHI" },
  { label: "Madhesh Province", key: "MADHESH" },
  { label: "Bagmati Province", key: "BAGMATI" },
  { label: "Gandaki Province", key: "GANDAKI" },
  { label: "Lumbini Province", key: "LUMBINI" },
  { label: "Karnali Province", key: "KARNALI" },
  { label: "Sudurpashchim Province", key: "SUDURPASHCHIM" },
];


const UniversalFilter = ({
  onFilterChange,
  showCourseName = true,
  showSemester = true,
  showAffiliation = true,
  initialFilters = {},
}) => {
  const [courseNames, setCourseNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState(initialFilters.courseNames || []);
  const [selectedSemesters, setSelectedSemesters] = useState(initialFilters.semesters || []);
  const [selectedAffiliations, setSelectedAffiliations] = useState(initialFilters.affiliations || []);

  // Fetch Course Names
  useEffect(() => {
    const fetchCourseNames = async () => {
      try {
       const { items: courses } = await getCourses();

        const uniqueNames = [...new Set(courses.map((c) => c.courseName).filter(Boolean))].sort();
        setCourseNames(uniqueNames);
        
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    if (showCourseName) fetchCourseNames();
  }, [showCourseName]);

  useEffect(() => {
    onFilterChange({
      courseNames: selectedCourses,
      semesters: selectedSemesters.map(String),
      affiliations: selectedAffiliations,
    });
  }, [selectedCourses, selectedSemesters, selectedAffiliations, onFilterChange]);

  const toggle = (list, setList, item) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const filteredCourses = courseNames.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetFilters = () => {
    setSelectedCourses([]);
    setSelectedSemesters([]);
    setSelectedAffiliations([]);
    setSearchTerm('');
  };

  return (
    <aside className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 
                       flex flex-col h-fit max-h-[calc(100vh-6rem)]"> {/* Stops below navbar */}
      
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-slate-900">Filters</h2>
          {(selectedCourses.length || selectedSemesters.length || selectedAffiliations.length) > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Clear All
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500">
          {selectedCourses.length + selectedSemesters.length + selectedAffiliations.length} selected
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Course Section */}
        {showCourseName && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Course Name</h3>
              {selectedCourses.length > 0 && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {selectedCourses.length}
                </span>
              )}
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {filteredCourses.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No courses found</p>
              ) : (
                filteredCourses.map((name) => (
                  <FilterItem
                    key={name}
                    label={name}
                    checked={selectedCourses.includes(name)}
                    onChange={() => toggle(selectedCourses, setSelectedCourses, name)}
                  />
                ))
              )}
            </div>
          </section>
        )}

        {/* Semester Section */}
        {showSemester && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Semester</h3>
              {selectedSemesters.length > 0 && (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  {selectedSemesters.length}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SEMESTERS.map(({ label, key }) => (
                <FilterItem
                  key={key}
                  label={`${label} Semester`}
                  checked={selectedSemesters.includes(String(key))}
                  onChange={() => toggle(selectedSemesters, setSelectedSemesters, String(key))}
                  compact
                />
              ))}
            </div>
          </section>
        )}

        {/* Affiliation Section */}
        {showAffiliation && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">University Affiliation</h3>
              {selectedAffiliations.length > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {selectedAffiliations.length}
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              {UNIVERSITIES.map(({ label, key }) => (
                <FilterItem
                  key={key}
                  label={label}
                  checked={selectedAffiliations.includes(key)}
                  onChange={() => toggle(selectedAffiliations, setSelectedAffiliations, key)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
};

const FilterItem = ({ label, checked, onChange, compact = false }) => (
  <label
    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                ${checked 
                  ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                  : 'hover:bg-slate-50 border border-transparent'
                } ${compact ? 'py-2' : ''}`}
  >
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-white border-2 border-slate-300 rounded 
                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer 
                   checked:border-blue-600"
      />
      {checked && (
        <svg className="absolute inset-0 w-4 h-4 pointer-events-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
    <span className={`font-medium text-sm transition-colors
                     ${checked ? 'text-blue-900' : 'text-slate-700'}`}>
      {label}
    </span>
  </label>
);

export default UniversalFilter;