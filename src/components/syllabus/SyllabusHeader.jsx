export default function SyllabusHeader({ totalResults }) {
  return (
    <div className="mb-6 md:mb-8 border-b border-gray-200 pb-4 md:pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-brand-navy tracking-tight">
          Course Syllabus Directory
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Access and download the latest curriculum documents for all university programs.
        </p>
      </div>
    </div>
  );
}
