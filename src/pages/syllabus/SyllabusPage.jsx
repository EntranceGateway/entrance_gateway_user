import { useEffect, useState } from "react";
import { getSyllabus } from "../../http/syllabus";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SyllabusTable from "../../components/syllabus/SyllabusTable";
import SyllabusFilters from "../../components/syllabus/SyllabusFilters";
import SyllabusHeader from "../../components/syllabus/SyllabusHeader";

const PAGE_SIZE = 10;

export default function SyllabusPage() {
  const [loading, setLoading] = useState(false);
  const [syllabi, setSyllabi] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  useEffect(() => {
    fetchSyllabus();
  }, [currentPage]);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const response = await getSyllabus(currentPage, PAGE_SIZE, "syllabusTitle", "asc");
      
      setSyllabi(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch syllabus:", err);
      setSyllabi([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering
  const filteredSyllabi = syllabi.filter((syllabus) => {
    const matchesSearch = !searchQuery.trim() || 
      syllabus.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      syllabus.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      syllabus.syllabusTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = !selectedCourse || syllabus.courseName === selectedCourse;
    const matchesSemester = !selectedSemester || syllabus.semester === parseInt(selectedSemester);
    
    return matchesSearch && matchesCourse && matchesSemester;
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage - 1); // Convert to 0-based for API
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Header */}
          <SyllabusHeader totalResults={totalElements} />

          {/* Filters */}
          <SyllabusFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
          />

          {/* Table */}
          <SyllabusTable
            syllabi={filteredSyllabi}
            loading={loading}
            currentPage={currentPage + 1} // Convert to 1-based for display
            totalPages={totalPages}
            totalItems={totalElements}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
