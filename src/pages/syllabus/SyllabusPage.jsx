import { useEffect, useState } from "react";
import { getSyllabusByFilters } from "../../http/syllabus";
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
  const [selectedAffiliation, setSelectedAffiliation] = useState("");

  useEffect(() => {
    fetchSyllabus();
  }, [currentPage, selectedCourse, selectedSemester, selectedAffiliation]);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const response = await getSyllabusByFilters({
        affiliation: selectedAffiliation,
        courseName: selectedCourse,
        semester: selectedSemester,
        page: currentPage,
        size: PAGE_SIZE,
        sortBy: "syllabusTitle",
        sortDir: "asc"
      });
      
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

  // Client-side search filtering (only for search query)
  const filteredSyllabi = syllabi.filter((syllabus) => {
    if (!searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      syllabus.subjectName?.toLowerCase().includes(searchLower) ||
      syllabus.courseCode?.toLowerCase().includes(searchLower) ||
      syllabus.syllabusTitle?.toLowerCase().includes(searchLower)
    );
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage - 1); // Convert to 0-based for API
  };

  const handleFilterChange = (filterType, value) => {
    // Reset to first page when filters change
    setCurrentPage(0);
    
    switch (filterType) {
      case 'course':
        setSelectedCourse(value);
        break;
      case 'semester':
        setSelectedSemester(value);
        break;
      case 'affiliation':
        setSelectedAffiliation(value);
        break;
      default:
        break;
    }
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
            onCourseChange={(value) => handleFilterChange('course', value)}
            selectedSemester={selectedSemester}
            onSemesterChange={(value) => handleFilterChange('semester', value)}
            selectedAffiliation={selectedAffiliation}
            onAffiliationChange={(value) => handleFilterChange('affiliation', value)}
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
