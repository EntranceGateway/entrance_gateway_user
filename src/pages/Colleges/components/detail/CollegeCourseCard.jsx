import { useNavigate } from 'react-router-dom';
import { Clock, Users, BookOpen } from 'lucide-react';

const AFFILIATION_LABELS = {
  TRIBHUVAN_UNIVERSITY: 'Tribhuvan University',
  KATHMANDU_UNIVERSITY: 'Kathmandu University',
  POKHARA_UNIVERSITY: 'Pokhara University',
  PURWANCHAL_UNIVERSITY: 'Purbanchal University',
};

const LEVEL_CONFIG = {
  BACHELOR: { label: 'Undergraduate', bgClass: 'bg-blue-50 text-blue-700' },
  MASTER: { label: 'Graduate', bgClass: 'bg-purple-50 text-purple-700' },
  PHD: { label: 'Doctorate', bgClass: 'bg-red-50 text-red-700' },
  PLUS_TWO: { label: 'High School', bgClass: 'bg-green-50 text-green-700' },
};

export function CollegeCourseCard({ course }) {
  const navigate = useNavigate();
  const levelConfig = LEVEL_CONFIG[course.courseLevel] || LEVEL_CONFIG.BACHELOR;
  const affiliation = AFFILIATION_LABELS[course.affiliation] || course.affiliation || '';

  const handleClick = () => {
    navigate(`/courses/${course.courseId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-amber-400/50 transition-colors cursor-pointer group"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors truncate">
              {course.courseName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {course.description || `${course.courseName} Program`}
            </p>
          </div>
          <span className={`${levelConfig.bgClass} px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap`}>
            {levelConfig.label}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-4">
          {course.duration && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Duration: {course.duration}</span>
            </div>
          )}
          {course.seats && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
              <Users className="w-4 h-4 text-amber-500" />
              <span>Seats: {course.seats}</span>
            </div>
          )}
        </div>
        
        {(course.admissionCriteria || affiliation) && (
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            {course.admissionCriteria && (
              <>
                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 sm:mb-2">Admission Criteria</h4>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{course.admissionCriteria}</p>
              </>
            )}
            {!course.admissionCriteria && affiliation && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Affiliated to {affiliation}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function CollegeCoursesList({ courses }) {
  if (!courses || courses.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 sm:p-10 text-center border border-gray-200">
        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <p className="text-gray-500 text-base sm:text-lg">No course information available at this time.</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6 flex items-center gap-2">
        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
        Courses Offered
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {courses.map((course) => (
          <CollegeCourseCard key={course.courseId} course={course} />
        ))}
      </div>
    </section>
  );
}
