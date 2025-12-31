import { useEffect, useState, useMemo } from "react";
import { getCourses } from "../../../http/course";
import CourseGrid from "../../../components/CourseGrid/CourseGrid";
import Pagination from "../../../components/Pagination/pagination";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import UniversalFilter from "../../../components/FilterSidebar/FilterSidebar";

// Normalize API data for display
const normalizeCourses = (data) =>
  data.map((course) => {
    const college = course.collegeResponses?.[0] || {};
    const slug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    return {
      id: course.courseId,
      name: course.courseName,
      description: course.description,
      affiliation: course.affiliation || college.affiliation || "Global University",
      collegeName: college.collegeName || "Main Campus",
      image: `/images/courses/${slug}.png`,
      level: course.courseLevel || "BACHELOR",
      type: course.courseType || "SEMESTER",
      semester: course.semester, // assuming API has semester info if needed
    };
  });

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    courseNames: [],
    semesters: [],
    affiliations: [],
  });
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Fetch courses on mount
  useEffect(() => {
    getCourses()
      .then((data) => {
        const normalized = normalizeCourses(data);
        setCourses(normalized);
        setFiltered(normalized);
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
      });
  }, []);

  // Apply filters whenever activeFilters change
  useEffect(() => {
    let result = courses;

    if (activeFilters.courseNames.length > 0) {
      result = result.filter((c) =>
        activeFilters.courseNames.includes(c.name)
      );
    }

    if (activeFilters.affiliations.length > 0) {
      result = result.filter((c) =>
        activeFilters.affiliations.includes(c.affiliation)
      );
    }

    // Optional: if your course object has semester info
    if (activeFilters.semesters.length > 0) {
      result = result.filter((c) =>
        activeFilters.semesters.includes(String(c.semester))
      );
    }

    setFiltered(result);
    setPage(1); // Reset to first page when filters change
  }, [activeFilters, courses]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Courses
            </h1>
            <p className="mt-3 text-lg text-slate-500 max-w-2xl">
              Advance your career with world-class programs from top-tier universities.
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Filter Courses</h2>

                <UniversalFilter
                  onFilterChange={setActiveFilters}
                  showCourseName={true}
                  showSemester={false} // Hide semester if not used in your data, or set true if available
                  showAffiliation={true}
                  initialFilters={activeFilters} // Optional: preserve state
                />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-slate-500 font-medium">
                  Showing{" "}
                  <span className="text-slate-900 font-bold">{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "course" : "courses"}
                </p>

                {activeFilters.courseNames.length > 0 ||
                activeFilters.affiliations.length > 0 ? (
                  <button
                    onClick={() => setActiveFilters({ courseNames: [], semesters: [], affiliations: [] })}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters
                  </button>
                ) : null}
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No courses found matching your filters.</p>
                </div>
              ) : (
                <CourseGrid data={paginated} />
              )}

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}