function formatAffiliation(affiliation) {
  if (!affiliation) return "Tribhuvan University";
  return affiliation.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function OldQuestionInfoSidebar({ question }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
      {/* Top Accent Bar */}
      <div className="h-1.5 bg-brand-navy w-full"></div>

      <div className="p-6">
        {/* Affiliation Header */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
            <span className="material-symbols-outlined text-brand-navy text-2xl">
              account_balance
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Affiliation
            </span>
            <h3 className="text-sm font-bold text-brand-navy">
              {formatAffiliation(question.affiliation)}
            </h3>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-roboto font-bold text-brand-navy mb-2">
          {question.setName}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Official entrance examination document for prospective students.
        </p>

        {/* Details */}
        <div className="space-y-4">
          {/* Subject */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <span className="material-symbols-outlined text-brand-blue text-xl">
                auto_stories
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">
                Subject
              </p>
              <p className="font-medium text-gray-900">{question.subject}</p>
            </div>
          </div>

          {/* Exam Year */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <span className="material-symbols-outlined text-brand-blue text-xl">
                calendar_month
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">
                Exam Year
              </p>
              <p className="font-medium text-gray-900">{question.year}</p>
            </div>
          </div>

          {/* Course */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <span className="material-symbols-outlined text-brand-blue text-xl">
                school
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">
                Course
              </p>
              <p className="font-medium text-gray-900">{question.courseName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-gray-400">
            ID: QSET-{question.year}-{question.id}
          </span>
          <div className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded text-xs font-medium">
            <span className="material-symbols-outlined text-xs">verified</span>
            Verified
          </div>
        </div>
      </div>
    </div>
  );
}
