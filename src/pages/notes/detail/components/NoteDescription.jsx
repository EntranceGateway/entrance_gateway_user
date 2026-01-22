export default function NoteDescription({ description }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-brand-blue">description</span>
        <h3 className="text-lg font-bold text-brand-navy font-roboto">Description</h3>
      </div>
      
      <div className="prose prose-sm prose-blue max-w-none text-gray-600">
        <p>
          {description || 'Comprehensive notes on basic concepts designed specifically for students. This document covers the fundamental structures and topics essential for upcoming assessments.'}
        </p>
        
        {!description && (
          <>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Introduction to key terminology and concepts.</li>
              <li>Overview of fundamental principles.</li>
              <li>Basic theory and major topics.</li>
              <li>Essential information for exams.</li>
            </ul>
            <p className="mt-3">
              These notes are curated from university lectures and are essential for upcoming internal assessments.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
