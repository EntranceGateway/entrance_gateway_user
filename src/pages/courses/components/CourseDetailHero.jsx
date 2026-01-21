import { Breadcrumb } from './Breadcrumb';

const LEVEL_LABELS = {
  BACHELOR: 'Bachelor',
  MASTERS: 'Masters',
  PLUS_TWO: 'Plus Two',
};

const AFFILIATION_LABELS = {
  TRIBHUVAN_UNIVERSITY: 'TU Affiliated',
  KATHMANDU_UNIVERSITY: 'KU Affiliated',
  POKHARA_UNIVERSITY: 'PU Affiliated',
  PURBANCHAL_UNIVERSITY: 'Purbanchal Affiliated',
  LUMBINI_UNIVERSITY: 'Lumbini Affiliated',
  MID_WESTERN_UNIVERSITY: 'Mid Western Affiliated',
  FAR_WESTERN_UNIVERSITY: 'Far Western Affiliated',
  NEB: 'NEB Affiliated',
};

export function CourseDetailHero({ course, onEnquiry }) {
  const levelLabel = LEVEL_LABELS[course?.courseLevel] || course?.courseLevel || 'Course';
  const affiliationLabel = AFFILIATION_LABELS[course?.affiliation] || 'Affiliated';

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Breadcrumb courseName={course?.courseName || 'Course'} />
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-brand-blue tracking-wide uppercase">
                {levelLabel}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 tracking-wide uppercase">
                {affiliationLabel}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-4 tracking-tight leading-tight">
              {course?.courseName}
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed">
              {course?.description || 'A comprehensive program designed to build expertise and prepare students for professional success in their chosen field.'}
            </p>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-auto">
            <button 
              onClick={onEnquiry}
              className="w-full md:w-auto bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span className="material-icons-round text-xl">how_to_reg</span>
              Enquiry Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
