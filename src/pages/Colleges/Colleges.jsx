import { useEffect, useState } from "react";
import { MapPin, ShieldCheck, ExternalLink, ArrowRight, Building2 } from "lucide-react";
import Pagination from "../../components/Pagination/pagination";
import { getColleges } from "../../http/colleges";
import { ResourceImage } from "../../components/common/ResourceViewer";

export default function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // The default image URL provided
  const DEFAULT_IMAGE = "https://i.pinimg.com/1200x/d1/18/66/d11866060740b0a32b219dc3581caaeb.jpg";
  const PAGE_SIZE = 6;

  const fetchCollegesData = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const result = await getColleges({ page: pageNumber, size: PAGE_SIZE });
      setColleges(result.items);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setPage(pageNumber);
      setError(false);
    } catch (err) {
      setError(true);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollegesData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (nextPage) => {
    if (nextPage !== page) {
      fetchCollegesData(nextPage);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <Building2 className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Connection Error</h3>
        <p className="text-slate-500 mt-2">Could not load the college directory.</p>
      </div>
    );
  }

  return (
    <section className="bg-slate-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured <span className="font-extrabold text-orange-600 ">Institutes</span> 
            </h2>
            <p className="mt-3 text-lg text-slate-500 max-w-2xl">
              Discover premier campuses with world-class infrastructure and academic excellence.
            </p>
          </div>
          
          <button className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            View All Campuses <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            colleges.map((college) => (
              <CollegeCard 
                key={college.collegeId} 
                college={college} 
                defaultImage={DEFAULT_IMAGE} 
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalElements}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
              isDisabled={loading}
              showPageInfo
            />
          </div>
        )}
      </div>
    </section>
  );
}

// --- CARD COMPONENT ---
function CollegeCard({ college, defaultImage }) {
  // Use first picture from collegePictureName array
  const imageFileName = college.collegePictureName?.[0];
  
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-56 overflow-hidden">
        {/* Image with Zoom Effect */}
        {imageFileName ? (
          <ResourceImage
            fileName={imageFileName}
            alt={college.collegeName}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
            fallback={defaultImage}
          />
        ) : (
          <img
            src={defaultImage}
            alt={college.collegeName}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        )}
        
        {/* Gradient Overlay (for text contrast if needed, subtly added) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Affiliation Badge (Floating) */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-indigo-600 shadow-lg border border-white/20">
            <ShieldCheck className="w-3 h-3 fill-current" />
            {college.affiliation ? college.affiliation.split(' ')[0] : 'Affiliated'}
          </span>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          {college.collegeName}
        </h3>

        {/* Location Row */}
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{college.location || "Location not available"}</span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-100 mb-6" />

        {/* Footer Actions */}
        <div className="mt-auto flex items-center justify-between">
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Visit Website <ExternalLink className="w-4 h-4" />
          </a>
          
          {/* Subtle decorative arrow */}
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
             <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SKELETON LOADER ---
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-full flex flex-col animate-pulse">
      {/* Image Placeholder */}
      <div className="h-56 bg-slate-200 w-full" />
      
      {/* Content Placeholder */}
      <div className="p-6 grow">
        <div className="h-7 bg-slate-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-6" />
        <div className="w-full h-px bg-slate-100 mb-6" />
        <div className="flex justify-between items-center mt-auto">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="w-8 h-8 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}