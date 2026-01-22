import { Link, useNavigate } from "react-router-dom";

const COURSE_COLORS = {
  CSIT: { bg: "bg-blue-100/50", text: "text-brand-blue", border: "border-blue-200" },
  BCA: { bg: "bg-indigo-100/50", text: "text-indigo-700", border: "border-indigo-200" },
  BIM: { bg: "bg-purple-100/50", text: "text-purple-700", border: "border-purple-200" },
  BIT: { bg: "bg-cyan-100/50", text: "text-cyan-700", border: "border-cyan-200" },
  BE_COMPUTER: { bg: "bg-green-100/50", text: "text-green-700", border: "border-green-200" },
};

export default function SyllabusTableRow({ syllabus, index }) {
  const navigate = useNavigate();
  const courseColor = COURSE_COLORS[syllabus.courseName] || COURSE_COLORS.CSIT;

  const handleRowClick = (e) => {
    // Don't navigate if clicking on a link
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      return;
    }
    navigate(`/syllabus/${syllabus.syllabusId}`);
  };

  return (
    <tr 
      onClick={handleRowClick}
      className="hover:bg-blue-50/30 transition-colors even:bg-gray-50 group cursor-pointer"
    >
      <td className="px-6 py-4 font-mono text-gray-600 font-medium">
        {syllabus.courseCode || "N/A"}
      </td>
      <td className="px-6 py-4 font-semibold text-brand-navy text-base">
        <Link
          to={`/syllabus/${syllabus.syllabusId}`}
          className="hover:text-brand-blue transition-colors"
        >
          {syllabus.subjectName || syllabus.syllabusTitle || "Untitled Subject"}
        </Link>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center rounded-full ${courseColor.bg} px-2.5 py-0.5 text-xs font-semibold ${courseColor.text} border ${courseColor.border}`}
        >
          {syllabus.courseName || "N/A"}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600">
        Year {syllabus.year || Math.ceil((syllabus.semester || 1) / 2)} / Sem {syllabus.semester || "I"}
      </td>
      <td className="px-6 py-4 text-gray-600 text-right font-medium">
        {syllabus.creditHours || 3} Cr
      </td>
    </tr>
  );
}
