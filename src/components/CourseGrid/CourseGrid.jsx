import { Link } from "react-router-dom";

export default function CourseGrid({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-16 w-16 text-slate-300 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No courses found
          </h3>
          <p className="text-slate-500">
            Try adjusting your filters or search for different programs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {data.map((course) => (
        <article
          key={course.id}
          className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 hover:-translate-y-2 transition-all duration-500 flex flex-col"
        >
          {/* Header Area (Replaces Image) */}
          <div className="relative p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] bg-slate-100 rounded-md border border-slate-200">
                {course.affiliation}
              </span>
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
            </div>

            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              {course.collegeName}
            </p>

            <h3 className="text-2xl font-black text-slate-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
              {course.name}
            </h3>
          </div>

          {/* Content Area */}
          <div className="p-6 pt-2 flex flex-col flex-1">
            <p className="text-sm text-slate-600 line-clamp-4 mb-8 leading-relaxed">
              {course.description ||
                "Comprehensive program designed to equip you with industry-relevant skills and knowledge through professional guidance."}
            </p>

            <div className="mt-auto">
              <Link
                to={`/courses/${course.id}`}
                className="inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors w-full justify-between"
                aria-label={`View details for ${course.name}`}
              >
                <span>View Program Details</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Decorative Bottom Bar */}
          <div className="h-1.5 w-0 group-hover:w-full bg-orange-500 transition-all duration-500"></div>
        </article>
      ))}
    </div>
  );
}