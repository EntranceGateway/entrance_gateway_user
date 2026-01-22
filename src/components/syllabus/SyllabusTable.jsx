import SyllabusTableRow from "./SyllabusTableRow";
import SyllabusTableSkeleton from "./SyllabusTableSkeleton";
import SyllabusTablePagination from "./SyllabusTablePagination";
import SyllabusTableMobile from "./SyllabusTableMobile";

export default function SyllabusTable({
  syllabi,
  loading,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-brand-navy text-white">
              <tr>
                <th
                  className="px-6 py-4 font-semibold tracking-wide border-b border-brand-navy/50"
                  scope="col"
                >
                  Course Code
                </th>
                <th
                  className="px-6 py-4 font-semibold tracking-wide border-b border-brand-navy/50 w-1/3"
                  scope="col"
                >
                  Subject Name
                </th>
                <th
                  className="px-6 py-4 font-semibold tracking-wide border-b border-brand-navy/50"
                  scope="col"
                >
                  Course
                </th>
                <th
                  className="px-6 py-4 font-semibold tracking-wide border-b border-brand-navy/50"
                  scope="col"
                >
                  Year / Semester
                </th>
                <th
                  className="px-6 py-4 font-semibold tracking-wide border-b border-brand-navy/50 text-right"
                  scope="col"
                >
                  Credit Hours
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <SyllabusTableSkeleton />
              ) : syllabi.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-icons-round text-gray-300 text-6xl mb-4">
                        search_off
                      </span>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        No syllabus found
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                syllabi.map((syllabus, index) => (
                  <SyllabusTableRow
                    key={syllabus.syllabusId || index}
                    syllabus={syllabus}
                    index={index}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && syllabi.length > 0 && (
          <SyllabusTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <SyllabusTableMobile
          syllabi={syllabi}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}
