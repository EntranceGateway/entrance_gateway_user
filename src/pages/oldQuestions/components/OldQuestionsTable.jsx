import { useNavigate } from "react-router-dom";

function getCourseColor(courseName) {
  const colors = {
    BCA: "bg-blue-100 text-blue-800",
    CSIT: "bg-indigo-100 text-indigo-800",
    BIT: "bg-purple-100 text-purple-800",
    BIM: "bg-green-100 text-green-800",
  };
  return colors[courseName] || "bg-gray-100 text-gray-800";
}

function formatAffiliation(affiliation) {
  if (!affiliation) return "Tribhuvan University";
  return affiliation.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function OldQuestionsTable({ questions, loading }) {
  const navigate = useNavigate();

  const handleViewClick = (question) => {
    navigate(`/old-questions/${question.id}`, { state: { question } });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">description</span>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Questions Found</h3>
          <p className="text-gray-500">Try adjusting your filters to find question papers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-navy text-white">
              <th className="px-6 py-4 text-sm font-semibold tracking-wide border-b border-gray-200">
                Set Name
              </th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wide border-b border-gray-200">
                Subject
              </th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wide border-b border-gray-200 text-center">
                Year
              </th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wide border-b border-gray-200">
                Course
              </th>
              <th className="px-6 py-4 text-sm font-semibold tracking-wide border-b border-gray-200">
                Affiliation
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((question, index) => (
              <tr
                key={question.id}
                onClick={() => handleViewClick(question)}
                className={`data-table-row transition-colors cursor-pointer ${
                  index % 2 === 1 ? "bg-gray-50" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400">description</span>
                    <span className="text-sm font-medium text-gray-900">{question.setName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{question.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-600 text-center">{question.year}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCourseColor(
                      question.courseName
                    )}`}
                  >
                    {question.courseName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    {formatAffiliation(question.affiliation)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {questions.map((question) => (
          <div 
            key={question.id} 
            onClick={() => handleViewClick(question)}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="material-symbols-outlined text-gray-400 text-xl shrink-0">
                  description
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {question.setName}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">{question.subject}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-500 shrink-0 ml-2">
                {question.year}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCourseColor(
                  question.courseName
                )}`}
              >
                {question.courseName}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 truncate max-w-[200px]">
                {formatAffiliation(question.affiliation)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
