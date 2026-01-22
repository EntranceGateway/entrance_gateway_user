import { Link } from "react-router-dom";
import SyllabusTablePagination from "./SyllabusTablePagination";

const COURSE_COLORS = {
  CSIT: { bg: "bg-blue-100/50", text: "text-brand-blue", border: "border-blue-200" },
  BCA: { bg: "bg-indigo-100/50", text: "text-indigo-700", border: "border-indigo-200" },
  BIM: { bg: "bg-purple-100/50", text: "text-purple-700", border: "border-purple-200" },
  BIT: { bg: "bg-cyan-100/50", text: "text-cyan-700", border: "border-cyan-200" },
  BE_COMPUTER: { bg: "bg-green-100/50", text: "text-green-700", border: "border-green-200" },
};

function SyllabusCard({ syllabus }) {
  const courseColor = COURSE_COLORS[syllabus.courseName] || COURSE_COLORS.CSIT;

  return (
    <Link 
      to={`/syllabus/${syllabus.syllabusId}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-brand-navy text-base hover:text-brand-blue transition-colors line-clamp-2">
            {syllabus.subjectName || syllabus.syllabusTitle || "Untitled Subject"}
          </h3>
          <p className="text-xs font-mono text-gray-500 mt-1">
            {syllabus.courseCode || "N/A"}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full ${courseColor.bg} px-2.5 py-0.5 text-xs font-semibold ${courseColor.text} border ${courseColor.border} ml-2 flex-shrink-0`}
        >
          {syllabus.courseName || "N/A"}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="material-icons-round text-gray-400 text-lg">school</span>
          <div>
            <p className="text-xs text-gray-500">Year / Semester</p>
            <p className="font-medium text-gray-700">
              Year {syllabus.year || Math.ceil((syllabus.semester || 1) / 2)} / Sem {syllabus.semester || "I"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-icons-round text-gray-400 text-lg">schedule</span>
          <div>
            <p className="text-xs text-gray-500">Credit Hours</p>
            <p className="font-medium text-gray-700">{syllabus.creditHours || 3} Cr</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SyllabusCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-16 ml-2"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function SyllabusTableMobile({
  syllabi,
  loading,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  return (
    <div className="space-y-4 mb-12">
      {loading ? (
        <>
          {[...Array(5)].map((_, i) => (
            <SyllabusCardSkeleton key={i} />
          ))}
        </>
      ) : syllabi.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 text-center">
          <span className="material-icons-round text-gray-300 text-6xl mb-4 block">
            search_off
          </span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            No syllabus found
          </h3>
          <p className="text-gray-500 text-sm px-4">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <>
          {syllabi.map((syllabus, index) => (
            <SyllabusCard key={syllabus.syllabusId || index} syllabus={syllabus} />
          ))}

          {/* Mobile Pagination */}
          {syllabi.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <SyllabusTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
