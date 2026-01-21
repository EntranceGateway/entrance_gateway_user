import { Globe, Phone, Mail, MapPin, Download, FileEdit } from 'lucide-react';

export function CollegeQuickActions({ isAdmissionsOpen = true }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
      <div className="space-y-2 sm:space-y-3">
        <button className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold py-2.5 sm:py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm sm:text-base">
          <FileEdit className="w-4 h-4 sm:w-5 sm:h-5" />
          Apply Now
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-all text-sm sm:text-base">
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          Download Brochure
        </button>
      </div>
      
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <span>Admissions Open</span>
          {isAdmissionsOpen && (
            <span className="text-green-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CollegeContactSidebar({ college }) {
  const website = college?.website;
  const contact = college?.contact;
  const email = college?.email;
  const location = college?.location || college?.address;

  const getWebsiteUrl = (url) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const getDisplayWebsite = (url) => {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  };

  const mapQuery = college ? encodeURIComponent(`${college.collegeName} ${location} Nepal`) : '';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-3 sm:mb-4">Contact Information</h3>
      
      <div className="space-y-3 sm:space-y-4 text-sm">
        {website && (
          <a
            href={getWebsiteUrl(website)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-amber-500 transition-colors group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 group-hover:bg-amber-400 group-hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-medium text-xs sm:text-sm truncate">{getDisplayWebsite(website)}</span>
          </a>
        )}
        
        {contact && (
          <a
            href={`tel:${contact}`}
            className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-amber-500 transition-colors group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 group-hover:bg-amber-400 group-hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <span className="font-medium text-xs sm:text-sm">{contact}</span>
          </a>
        )}
        
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-amber-500 transition-colors group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 group-hover:bg-amber-400 group-hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <span className="font-medium text-xs sm:text-sm truncate">{email}</span>
          </a>
        )}
      </div>
      
      {location && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 rounded-lg overflow-hidden h-24 sm:h-32 bg-gray-200 relative group cursor-pointer block"
        >
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${mapQuery}&zoom=14&size=400x200&key=`}
            alt="Map Location"
            className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="bg-white/80 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
              View on Map
            </span>
          </div>
        </a>
      )}
    </div>
  );
}
