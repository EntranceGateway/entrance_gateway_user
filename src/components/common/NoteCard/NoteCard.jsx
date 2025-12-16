import React from "react";
import { BookOpen } from "lucide-react";

export default function NoteCard({ note, index, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        <img
          src={`https://picsum.photos/seed/${note.subject + index}/400/250`}
          alt={note.subject}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 mb-2">
            NOTE
          </span>
          <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 drop-shadow-sm">
            {note.subject}
          </h3>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {note.noteDescription || "No description provided for this resource."}
          </p>
        </div>
        <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between text-indigo-600">
          <span className="text-xs font-semibold flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <BookOpen size={14} className="mr-2" />
            View Details
          </span>
        </div>
      </div>
    </div>
  );
}
