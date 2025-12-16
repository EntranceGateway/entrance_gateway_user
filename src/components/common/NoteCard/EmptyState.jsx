import React from "react";
import { FileText } from "lucide-react";

export default function EmptyState({ title = "No notes found", message }) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
      <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="text-indigo-500" size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-2 max-w-sm mx-auto">
        {message || "We couldn't find any uploaded notes for this specific course and semester yet."}
      </p>
    </div>
  );
}
