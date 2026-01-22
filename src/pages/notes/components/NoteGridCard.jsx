import { useNavigate } from "react-router-dom";

export default function NoteGridCard({ note }) {
  const navigate = useNavigate();

  const handleViewNote = () => {
    navigate(`/note/${note.noteId}`);
  };

  return (
    <div className="group bg-white border border-gray-200 hover:border-brand-blue/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Header with Badges */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600 font-mono tracking-tight">
            {note.subjectCode || "N/A"}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-brand-blue/10 text-brand-blue">
            {note.courseName || "N/A"}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-brand-navy mb-2 line-clamp-1 group-hover:text-brand-blue transition-colors">
        {note.subject || note.noteName || "Untitled Note"}
      </h3>

      {/* Year & Semester Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {note.year && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200 text-gray-500 uppercase tracking-wide">
            {note.year} Year
          </span>
        )}
        {note.semester && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200 text-gray-500 uppercase tracking-wide">
            {note.semester} Semester
          </span>
        )}
      </div>

      {/* University */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
        <span className="material-symbols-outlined text-sm">account_balance</span>
        <span>{note.affiliation || note.university || "Tribhuvan University"}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed flex-grow">
        {note.noteDescription || note.description || "Comprehensive study material for this subject."}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
        <button
          onClick={handleViewNote}
          className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-sm"
        >
          View Note
        </button>
      </div>
    </div>
  );
}
