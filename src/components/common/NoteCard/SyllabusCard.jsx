import { FileText, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SyllabusCard({ syllabus }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/syllabus/${syllabus.syllabusId}`)}
      className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl 
                 border border-slate-100 overflow-hidden transition-all duration-300"
    >
      <div className="p-5">
        {/* Header: Icon + Title + Course Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-linear-to-br from-blue-100 to-blue-50 rounded-xl 
                          group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 line-clamp-1">
              {syllabus.syllabusTitle}
            </h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-1 font-medium">
              {syllabus.courseCode} • {syllabus.creditHours} Credit{syllabus.creditHours !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-5 leading-relaxed">
          Official syllabus for {syllabus.courseName} - Year {syllabus.year}
        </p>

        {/* Footer: Program Name + Semester Badge */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <GraduationCap size={14} />
            <span className="font-medium">{syllabus.courseName}</span>
          </div>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
            Sem {syllabus.semester}
          </span>
        </div>
      </div>

      {/* Animated Bottom Gradient Bar */}
      <div className="h-1 bg-linear-to-r from-blue-500 to-indigo-600 opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}