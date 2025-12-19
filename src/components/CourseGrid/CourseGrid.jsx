import { Link } from "react-router-dom";

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80";

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
          className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 hover:-translate-y-2 transition-all duration-500"
        >
          {/* Image */}
          <div className="relative h-56 overflow-hidden bg-slate-100">
            <img
              src={course.image}
              alt={`${course.name} - ${course.collegeName}`}
              onError={(e) => (e.target.src = DEFAULT_FALLBACK_IMAGE)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />

            {/* University Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-block px-4 py-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider bg-white/80 backdrop-blur-md rounded-full border border-white/50 shadow-md">
                {course.university}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              {course.collegeName}
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
              {course.name}
            </h3>

            <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
              {course.description ||
                "Comprehensive program designed to equip you with industry-relevant skills and knowledge."}
            </p>

            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors"
              aria-label={`View details for ${course.name}`}
            >
              View Details
              <span className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}