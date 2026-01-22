import { useState } from "react";

const COURSES = [
  { value: "", label: "All Programs" },
  { value: "CSIT", label: "BSc. CSIT" },
  { value: "BCA", label: "BCA" },
  { value: "BIM", label: "BIM" },
  { value: "BIT", label: "BIT" },
  { value: "BE_COMPUTER", label: "B.E. Computer" },
];

const SEMESTERS = [
  { value: "", label: "All Semesters" },
  { value: "1", label: "First Semester" },
  { value: "2", label: "Second Semester" },
  { value: "3", label: "Third Semester" },
  { value: "4", label: "Fourth Semester" },
  { value: "5", label: "Fifth Semester" },
  { value: "6", label: "Sixth Semester" },
  { value: "7", label: "Seventh Semester" },
  { value: "8", label: "Eighth Semester" },
];

export default function SyllabusFilters({
  searchQuery,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  selectedSemester,
  onSemesterChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 mb-6 md:mb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <label
            className="block text-xs font-medium text-gray-500 mb-1"
            htmlFor="search"
          >
            Subject Search
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-icons-round text-gray-400 text-xl">
                search
              </span>
            </div>
            <input
              className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6"
              id="search"
              name="search"
              placeholder="Search by subject name or code..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Course Dropdown */}
        <div className="md:col-span-3">
          <label
            className="block text-xs font-medium text-gray-500 mb-1"
            htmlFor="course"
          >
            Course Program
          </label>
          <div className="relative">
            <select
              className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-blue sm:text-sm sm:leading-6 appearance-none bg-white"
              id="course"
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
            >
              {COURSES.map((course) => (
                <option key={course.value} value={course.value}>
                  {course.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="material-icons-round text-gray-400 text-xl">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Semester Dropdown */}
        <div className="md:col-span-3">
          <label
            className="block text-xs font-medium text-gray-500 mb-1"
            htmlFor="semester"
          >
            Semester
          </label>
          <div className="relative">
            <select
              className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-blue sm:text-sm sm:leading-6 appearance-none bg-white"
              id="semester"
              value={selectedSemester}
              onChange={(e) => onSemesterChange(e.target.value)}
            >
              {SEMESTERS.map((sem) => (
                <option key={sem.value} value={sem.value}>
                  {sem.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="material-icons-round text-gray-400 text-xl">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
