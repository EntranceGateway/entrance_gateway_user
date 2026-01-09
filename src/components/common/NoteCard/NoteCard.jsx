import {
  FileText,
  GraduationCap,
  ChevronRight,
  Clock,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCourseName, formatNoteName } from "../../../utils/formatters";

export default function NoteCard({ note }) {
  const navigate = useNavigate();
  const noteTitle = formatNoteName(note.noteName);

  /* ---------------- COMPONENT ---------------- */

  return (
    <div
      onClick={() => navigate(`/note/${note.noteId}`)}
      className="group relative cursor-pointer bg-white rounded-3xl
                 border border-slate-200 hover:border-orange-200
                 transition-all duration-500
                 hover:shadow-[0_20px_50px_rgba(255,115,0,0.1)]
                 flex flex-col h-full overflow-hidden"
    >
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-orange-50
                      rounded-full group-hover:bg-orange-100 transition opacity-50" />

      <div className="p-6 relative flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="p-3.5 bg-linear-to-br from-orange-500 to-orange-600
                          rounded-2xl shadow-lg shadow-orange-200
                          group-hover:scale-110 group-hover:rotate-3
                          transition-all duration-300">
            <FileText className="w-6 h-6 text-white" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-widest
                           text-slate-400 bg-slate-50 px-2 py-1 rounded-md
                           border border-slate-100">
            {note.subjectCode}
          </span>
        </div>

        {/* Title & Note Name */}
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-extrabold text-slate-900
                         group-hover:text-orange-600 transition-colors">
            {note.subject}
          </h3>

          {/* FULL NOTE NAME (Professional UX) */}
          <div className="flex items-start gap-2">
            <BookOpen size={15} className="text-orange-400 mt-0.5" />
            <p
              title={noteTitle} // native tooltip
              className="text-sm font-medium text-slate-600
                         leading-snug line-clamp-3"
            >
              {noteTitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6">
          {note.noteDescription ||
            "Access comprehensive study materials and lecture highlights for this module."}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-5 border-t border-slate-50
                        flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="bg-slate-100 p-1 rounded-md">
                <GraduationCap size={14} className="text-slate-500" />
              </div>
              <span className="text-xs font-bold tracking-tight">
                {formatCourseName(note.courseName)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-orange-600
                               bg-orange-50 px-2 py-0.5 rounded-lg">
                SEM {note.semester}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock size={12} /> 2025
              </span>
            </div>
          </div>

          <div className="w-10 h-10 flex items-center justify-center rounded-full
                          bg-slate-50 group-hover:bg-orange-600
                          group-hover:text-white transition-all">
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
