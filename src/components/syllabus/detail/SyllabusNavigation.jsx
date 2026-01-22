import { Link } from "react-router-dom";

export default function SyllabusNavigation({ syllabus }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Previous Subject */}
        <Link
          to="/syllabus"
          className="flex items-center gap-3 text-gray-500 hover:text-brand-navy transition-colors group w-full sm:w-auto"
        >
          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-brand-gold/20 transition-colors">
            <span className="material-icons-round">arrow_back</span>
          </div>
          <div className="text-left">
            <span className="block text-xs uppercase tracking-wide text-gray-500">
              Back to
            </span>
            <span className="font-bold text-sm text-gray-700">
              Syllabus List
            </span>
          </div>
        </Link>

        {/* View Full Semester */}
        <Link
          to={`/syllabus?course=${syllabus.courseName}&semester=${syllabus.semester}`}
          className="text-brand-blue hover:underline text-sm font-semibold"
        >
          View Full Semester {syllabus.semester} Syllabus
        </Link>

        {/* Next Subject - Placeholder */}
        <div className="flex items-center gap-3 text-gray-300 w-full sm:w-auto text-right opacity-50 cursor-not-allowed">
          <div className="text-right">
            <span className="block text-xs uppercase tracking-wide">
              Next Subject
            </span>
            <span className="font-bold text-sm">Not Available</span>
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <span className="material-icons-round">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  );
}
