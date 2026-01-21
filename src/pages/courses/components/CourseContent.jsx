import { CheckCircle, Info } from 'lucide-react';

export function CourseOverview({ course, description }) {
  return (
    <section className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-4 sm:mb-5 flex items-center gap-2">
        <span className="material-icons-round text-brand-blue">description</span>
        Course Overview
      </h2>
      <div className="prose prose-blue text-gray-600 max-w-none leading-relaxed text-sm sm:text-base">
        <p className="mb-4">
          {description || `The ${course?.courseName || 'course'} program is crafted for students aiming to pursue a career in their chosen field. This course provides a blend of theoretical knowledge and practical insights.`}
        </p>
        <p className="mb-4">
          Over the course of study, students delve into core subjects and develop essential skills required for professional success. The curriculum is designed not only to prepare students for higher education but also to instill industry-ready competencies.
        </p>
        <p>
          Upon completion, graduates are well-equipped to navigate professional environments or pursue higher education in recognized universities locally and abroad.
        </p>
      </div>
    </section>
  );
}

export function AdmissionRequirements({ criteria }) {
  const criteriaPoints = criteria
    ? criteria
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(s => s && !s.toLowerCase().includes('to study'))
        .map(s => s.charAt(0).toUpperCase() + s.slice(1) + (s.endsWith('.') ? '' : '.'))
    : [];

  const defaultRequirements = [
    { title: 'GPA 2.0+', description: 'Minimum overall aggregate score' },
    { title: 'Grade C+', description: 'In English, Math & related subjects' },
    { title: 'Character Cert', description: 'Clean record from previous institution' },
    { title: 'Entrance Exam', description: 'Must pass college entrance test' },
  ];

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-5 sm:mb-6 flex items-center gap-2">
        <span className="material-icons-round text-brand-blue">checklist</span>
        Admission Requirements
      </h2>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 sm:p-5 mb-6 sm:mb-8">
        <div className="flex gap-3 sm:gap-4">
          <Info className="w-6 h-6 sm:w-8 sm:h-8 text-brand-blue flex-shrink-0" />
          <div>
            <h4 className="font-bold text-brand-navy text-sm sm:text-base">Eligibility Criteria</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Applicants must have successfully completed previous level education with the following minimum grades.
            </p>
          </div>
        </div>
      </div>
      
      {criteriaPoints.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {criteriaPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-semantic-success flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{point}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {defaultRequirements.map((req, index) => (
            <div key={index} className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
              <CheckCircle className="w-5 h-5 text-semantic-success flex-shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-brand-navy text-base sm:text-lg">{req.title}</span>
                <span className="text-xs sm:text-sm text-gray-500">{req.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
