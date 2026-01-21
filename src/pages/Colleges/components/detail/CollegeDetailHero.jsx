import { MapPin, GraduationCap, Calendar, BadgeCheck, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ResourceImage } from '../../../../components/common/ResourceViewer';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&q=80&w=1200&auto=format&fit=crop';

const AFFILIATION_LABELS = {
  TRIBHUVAN_UNIVERSITY: 'Tribhuvan University',
  KATHMANDU_UNIVERSITY: 'Kathmandu University',
  POKHARA_UNIVERSITY: 'Pokhara University',
  PURWANCHAL_UNIVERSITY: 'Purbanchal University',
  LUMBINI_UNIVERSITY: 'Lumbini University',
  MID_WESTERN_UNIVERSITY: 'Mid Western University',
  FAR_WESTERN_UNIVERSITY: 'Far Western University',
  CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY: 'Foreign Affiliated',
};

export function CollegeDetailHero({ college, imageFileName }) {
  const collegeName = college?.collegeName || 'College';
  const location = college?.location || college?.address || 'Nepal';
  const affiliation = AFFILIATION_LABELS[college?.affiliation] || college?.affiliation || 'Affiliated University';
  const establishedYear = college?.establishedYear || '';
  const logoName = college?.logoName;
  
  // Get all images for carousel
  const images = college?.collegePictureName || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 300); // Half of transition duration for smooth effect
    }, 4000); // Change image every 4 seconds
    
    return () => clearInterval(interval);
  }, [images.length, isPaused]);
  
  const nextImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 300);
  };
  
  const goToImage = (index) => {
    if (index === currentImageIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 300);
  };
  
  const currentImage = images[currentImageIndex];

  return (
    <div 
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Background Images with smooth transition */}
      <div className="relative w-full h-full">
        {currentImage ? (
          <ResourceImage
            fileName={currentImage}
            alt={`${collegeName} Campus`}
            className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            fallback={DEFAULT_IMAGE}
          />
        ) : (
          <img
            src={DEFAULT_IMAGE}
            alt={`${collegeName} Campus`}
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>
      
      {/* Carousel Controls - Only show if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10 opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75 w-2'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
          {/* Logo Image - Use logoName from API */}
          <div className="hidden md:block bg-white p-3 rounded-xl shadow-lg flex-shrink-0">
            {logoName ? (
              <div className="w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center overflow-hidden">
                <ResourceImage
                  fileName={logoName}
                  alt={`${collegeName} Logo`}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                  fallback={null}
                />
              </div>
            ) : (
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-blue-900 text-white flex items-center justify-center rounded-lg font-bold text-xl lg:text-2xl">
                {collegeName.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="text-white flex-grow">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-amber-400 text-blue-900 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase">
                Featured Institute
              </span>
              <span className="flex items-center gap-1 text-[10px] sm:text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">
                <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                Verified
              </span>
            </div>
            
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 tracking-tight">
              {collegeName}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base text-gray-200">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                {location}
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                {affiliation}
              </div>
              {establishedYear && (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  Estd. {establishedYear}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
