export default function NoteInfoSidebar({ note }) {
  if (!note) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-navy font-roboto">
              Note Information
            </h2>
            <p className="text-xs text-gray-500 mt-1">Metadata & details</p>
          </div>
          <span className="material-symbols-outlined text-brand-blue/20 text-3xl">
            info
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* University */}
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
            <span className="material-symbols-outlined text-brand-blue text-2xl">
              account_balance
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              University
            </p>
            <p className="text-sm font-bold text-gray-900">
              {note.affiliation?.replace(/_/g, ' ') || 'Tribhuvan University'}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Subject */}
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-brand-blue/10 rounded text-brand-blue">
              <span className="material-symbols-outlined text-lg">menu_book</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Subject</p>
              <p className="text-sm font-semibold text-gray-900">
                {note.subject || 'N/A'}
              </p>
            </div>
          </div>

          {/* Subject Code */}
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-brand-blue/10 rounded text-brand-blue">
              <span className="material-symbols-outlined text-lg">tag</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Subject Code</p>
              <p className="text-sm font-semibold text-gray-900 font-mono">
                {note.subjectCode || 'N/A'}
              </p>
            </div>
          </div>

          {/* Course */}
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-brand-blue/10 rounded text-brand-blue">
              <span className="material-symbols-outlined text-lg">school</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Course</p>
              <p className="text-sm font-semibold text-gray-900">
                {note.courseName || 'N/A'}
              </p>
            </div>
          </div>

          {/* Academic Period */}
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-brand-blue/10 rounded text-brand-blue">
              <span className="material-symbols-outlined text-lg">calendar_month</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Academic Period</p>
              <p className="text-sm font-semibold text-gray-900">
                {note.year ? `${note.year}${note.year === 1 ? 'st' : note.year === 2 ? 'nd' : note.year === 3 ? 'rd' : 'th'} Year` : ''} 
                {note.year && note.semester ? ' / ' : ''}
                {note.semester ? `${note.semester}${note.semester === 1 ? 'st' : note.semester === 2 ? 'nd' : note.semester === 3 ? 'rd' : 'th'} Semester` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="pt-4 border-t border-gray-100 flex gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Verified
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            PDF
          </span>
        </div>
      </div>
    </div>
  );
}
