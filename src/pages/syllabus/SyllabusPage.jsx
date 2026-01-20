import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Eye, Calendar, BookOpen } from "lucide-react";
import { getSyllabus, getSyllabusFile } from "../../http/syllabus";
import Pagination from "../../components/Pagination/pagination";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function SyllabusPage() {
  const navigate = useNavigate();
  const [syllabusData, setSyllabusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("syllabusTitle");
  const [sortDir, setSortDir] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch syllabus with pagination
  const fetchSyllabus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await getSyllabus({ page, size, sortBy, sortDir }, token);
      setSyllabusData(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch syllabus:", err);
      setError(err.message || "Failed to load syllabus");
    } finally {
      setLoading(false);
    }
  }, [page, size, sortBy, sortDir]);

  useEffect(() => {
    fetchSyllabus();
  }, [fetchSyllabus]);

  // Handle pagination change
  const handlePageChange = ({ page: newPage, size: newSize, sortBy: newSortBy, sortDir: newSortDir }) => {
    setPage(newPage);
    setSize(newSize);
    setSortBy(newSortBy);
    setSortDir(newSortDir);
  };

  // Handle download syllabus PDF
  const handleDownload = async (syllabusId, title) => {
    try {
      const token = localStorage.getItem("token");
      const response = await getSyllabusFile(syllabusId, token);
      
      // Create blob from response
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title || "syllabus"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download syllabus:", err);
      alert("Failed to download syllabus. Please try again.");
    }
  };

  // Handle view syllabus
  const handleView = (syllabusId) => {
    navigate(`/syllabus/${syllabusId}`);
  };

  // Sort options
  const sortOptions = [
    { value: "syllabusTitle", label: "Title" },
    { value: "courseCode", label: "Course Code" },
    { value: "semester", label: "Semester" },
  ];

  if (error && !loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
          <FileText size={48} className="mb-4" />
          <p className="text-lg font-medium">{error}</p>
          <button
            onClick={fetchSyllabus}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-6 border-gray-200">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Syllabus Library
              </h1>
              <p className="text-lg text-gray-500 mt-2 font-medium">
                Access and download course syllabi
              </p>
            </div>
            {!loading && (
              <span className="mt-4 md:mt-0 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100">
                {totalElements} {totalElements === 1 ? "Syllabus" : "Syllabi"} Available
              </span>
            )}
          </div>
        </div>

        {/* Syllabus Table */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <SkeletonTable />
          ) : syllabusData.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Semester
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credits
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {syllabusData.map((item) => (
                        <SyllabusRow
                          key={item.syllabusId}
                          syllabus={item}
                          onDownload={handleDownload}
                          onView={handleView}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    size={size}
                    sortBy={sortBy}
                    sortDir={sortDir}
                    onPageChange={handlePageChange}
                    showSizeSelector={true}
                    showSortSelector={true}
                    sortOptions={sortOptions}
                    pageSizeOptions={[5, 10, 20, 50]}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Syllabus Table Row Component
function SyllabusRow({ syllabus, onDownload, onView }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-indigo-600 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {syllabus.syllabusTitle || "Untitled"}
            </div>
            <div className="text-sm text-gray-500">
              {syllabus.subjectName}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{syllabus.courseName || "—"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
          {syllabus.courseCode || "—"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        Sem {syllabus.semester}, Year {syllabus.year}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {syllabus.creditHours || 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onView(syllabus.syllabusId)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </button>
          <button
            onClick={() => onDownload(syllabus.syllabusId, syllabus.syllabusTitle || "syllabus")}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

// Skeleton Table Loader
function SkeletonTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </th>
              <th className="px-6 py-3 text-right">
                <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Syllabus Card Component (REMOVED - keeping for reference if needed)
function SyllabusCard({ syllabus, onDownload, onView }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-white">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {syllabus.syllabusTitle || "Untitled Syllabus"}
            </h3>
            {syllabus.courseName && (
              <p className="text-sm text-gray-500 mt-1">
                {syllabus.courseName} - Semester {syllabus.semester}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        {syllabus.subjectName && (
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{syllabus.subjectName}</span>
          </div>
        )}
        
        {syllabus.courseCode && (
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 text-xs">
              Course Code: {syllabus.courseCode}
            </span>
          </div>
        )}
        
        {syllabus.creditHours && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 text-xs">
              Credits: {syllabus.creditHours}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 pt-0 flex gap-3">
        <button
          onClick={() => onView(syllabus.syllabusId)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={() => onDownload(syllabus.syllabusId, syllabus.syllabusTitle || "syllabus")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
}

// Skeleton Loader
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="p-6 pt-0 flex gap-3">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="p-6 bg-gray-100 rounded-full mb-4">
        <FileText className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">No Syllabus Found</h3>
      <p className="text-gray-500 mt-2 max-w-md">
        There are no syllabi available at the moment. Please check back later.
      </p>
    </div>
  );
}
