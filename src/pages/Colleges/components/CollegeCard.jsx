import { useNavigate } from 'react-router-dom';
import { MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { ResourceImage } from '../../../components/common/ResourceViewer';

const AFFILIATION_SHORT = {
  TRIBHUVAN_UNIVERSITY: 'Tribhuvan University',
  KATHMANDU_UNIVERSITY: 'Kathmandu University',
  POKHARA_UNIVERSITY: 'Pokhara University',
  PURBANCHAL_UNIVERSITY: 'Purbanchal University',
  NEB: 'NEB',
};

const COLLEGE_IMAGES = {
  default: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKJvzzNiNHcWkfeGuSJLp3McD_vw4CeM7I0Vf1PtSOWOMTeM7fhnimuVaA8sInFrd95WNMm_7iaVetklZe1kWKRNz7rrLRDEBDzMNSPVZdgVHlcm86x7idWYbrZgkaRrrNxJRJ61I1HXa4kQ97sF_W8o7AFFwau-tQJkvlBlmiC4C8D9ZAfc5gsv8ENJUZcJf2qzETusvmP4quWf76VWr9tsZTicnLXoLjjSQTJB4aw8KJrMBYU4j2MD55t1xIOIcI7eRZQiztOr8",
};

export function CollegeCard({ college }) {
  const navigate = useNavigate();
  const affiliationLabel = AFFILIATION_SHORT[college.affiliation] || college.affiliation || 'Affiliated';
  
  const category = college.courses?.[0]?.category || 
    (college.collegeName?.toLowerCase().includes('engineering') ? 'Engineering' : 
     college.collegeName?.toLowerCase().includes('medical') ? 'Medical Science' : 'Management & IT');

  const handleCardClick = () => {
    navigate(`/colleges/${college.collegeId}`);
  };

  const handleWebsiteClick = (e) => {
    e.stopPropagation();
    if (college.website) {
      window.open(college.website, '_blank');
    }
  };

  // Use first picture from collegePictureName array, fallback to default
  const imageFileName = college.collegePictureName?.[0];

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all group h-full flex flex-col hover:-translate-y-1 duration-300 cursor-pointer"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {imageFileName ? (
          <ResourceImage
            fileName={imageFileName}
            alt={college.collegeName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            fallback={COLLEGE_IMAGES.default}
          />
        ) : (
          <img 
            src={COLLEGE_IMAGES.default} 
            alt={college.collegeName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-brand-blue/90 backdrop-blur text-[10px] font-bold uppercase tracking-wide rounded-full text-white shadow-sm border border-white/20">
            {category}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-display font-bold text-lg sm:text-xl drop-shadow-md line-clamp-2">
            {college.collegeName}
          </h3>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-gray-500 mb-3">
          <span className="material-icons-round text-lg text-brand-blue">account_balance</span>
          <span className="text-xs font-semibold tracking-wide uppercase">{affiliationLabel}</span>
        </div>
        
        <div className="flex items-start gap-2 text-gray-500 text-sm mb-4 sm:mb-6 flex-grow">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{college.address || college.location || 'Nepal'}</span>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            onClick={handleWebsiteClick}
            className="text-xs font-medium text-gray-400 flex items-center gap-1 hover:text-brand-blue transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Website
          </button>
          
          <span className="bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
            View Details <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
