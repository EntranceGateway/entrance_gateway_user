export default function SyllabusDetailHeader({ syllabus }) {
  return (
    <>
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-brand-navy text-3xl md:text-4xl font-black leading-tight tracking-tight mb-2">
          {syllabus.subjectName || syllabus.syllabusTitle || "Untitled Subject"}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-brand-gold/20 text-brand-navy px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
            Core Course
          </span>
          <p className="text-gray-600 text-base font-normal">
            Course Code: {syllabus.courseCode || "N/A"} | {syllabus.courseName || "N/A"}
          </p>
        </div>
      </div>
    </>
  );
}
