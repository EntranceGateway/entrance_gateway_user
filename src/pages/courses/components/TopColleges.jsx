import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const DEFAULT_COLLEGE_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=2064';

export function TopColleges({ colleges = [] }) {
  const displayColleges = colleges.slice(0, 2);
  
  if (displayColleges.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-5 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
        <h3 className="text-base sm:text-lg font-bold text-brand-navy">Top Colleges</h3>
        <Link 
          to="/colleges" 
          className="text-[10px] sm:text-xs text-brand-blue font-bold hover:underline uppercase tracking-wide"
        >
          View All
        </Link>
      </div>
      
      <div className="space-y-5 sm:space-y-6">
        {displayColleges.map((college, index) => (
          <div key={college.collegeId || index} className={`group ${index > 0 ? 'border-t border-gray-100 pt-4 sm:pt-5' : ''}`}>
            <div className="flex items-start gap-3 sm:gap-4 mb-3">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-brand-navy flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {college.imageUrl ? (
                  <img 
                    src={college.imageUrl} 
                    alt={college.collegeName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="font-bold text-white text-xs tracking-tighter">${college.collegeName?.slice(0, 3).toUpperCase() || 'COL'}</span>`;
                    }}
                  />
                ) : (
                  <span className="font-bold text-white text-xs tracking-tighter">
                    {college.collegeName?.split(' ').map(w => w[0]).slice(0, 3).join('').toUpperCase() || 'COL'}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight group-hover:text-brand-blue transition-colors mb-1 line-clamp-2">
                  {college.collegeName}
                </h4>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                  <span className="text-[10px] sm:text-xs text-gray-500 truncate">
                    {college.location || 'Nepal'}
                  </span>
                </div>
              </div>
            </div>
            <Link 
              to={`/colleges/${college.collegeId}`}
              className="block w-full py-2 sm:py-2.5 text-center text-xs sm:text-sm font-semibold text-brand-blue bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
            >
              View College
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
