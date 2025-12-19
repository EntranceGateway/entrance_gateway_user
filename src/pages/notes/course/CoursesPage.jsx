import { useEffect, useState } from "react";

import { getCourses } from "../../../http/course";
import { UNIVERSITIES } from "../../../constants/universities";
import FilterSidebar from "../../../components/FilterSidebar/FilterSidebar";
import CourseGrid from "../../../components/CourseGrid/CourseGrid";
import Pagination from "../../../components/Pagination/pagination";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const normalizeCourses = (data) =>
  data.map(course => {
    const college = course.collegeResponses?.[0] || {};
    const slug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    return {
      id: course.courseId,
      name: course.courseName,
      description: course.description,
      university: college.affiliation || "Global University",
      collegeName: college.collegeName || "Main Campus",
      image: `/images/courses/${slug}.png`,
    };
  });

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    getCourses().then(data => {
      const normalized = normalizeCourses(data);
      setCourses(normalized);
      setFiltered(normalized);
    });
  }, []);

  useEffect(() => {
    let result = courses;
    if (selectedUniversities.length) {
      result = result.filter(c => selectedUniversities.includes(c.university));
    }
    if (selectedCourses.length) {
      result = result.filter(c => selectedCourses.includes(c.name));
    }
    setFiltered(result);
    setPage(1);
  }, [selectedUniversities, selectedCourses, courses]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Our Courses</h1>
          <p className="mt-3 text-lg text-slate-500 max-w-2xl">
            Advance your career with world-class programs from top-tier universities.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar - Fixed width on Desktop, Full on Mobile */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <FilterSidebar
              universities={UNIVERSITIES}
              courses={courses}
              selectedUniversities={selectedUniversities}
              setSelectedUniversities={setSelectedUniversities}
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
            />
          </aside>

          {/* Main Grid Section */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-500 font-medium">
                Showing <span className="text-slate-900">{filtered.length}</span> courses
              </p>
            </div>
            
            <CourseGrid data={paginated} />

            <div className="mt-12 flex justify-center">
              <Pagination 
                page={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
              />
            </div>
          </main>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}