// src/components/cards/AdCard.jsx
import React from 'react';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

const AdCard = ({ 
  title, 
  banner, 
  bannerUrl, 
  badge = "Exclusive" 
}) => {
  return (
    <article className="h-full w-full max-w-[340px] mx-auto">
      <a
        href={bannerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white 
                   border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                   transition-all duration-500 ease-out
                   hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5
                   focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
        aria-label={`Sponsored advertisement: ${title}`}
      >
        {/* --- Image Section --- */}
        <div className="relative w-full aspect-4/3 overflow-hidden bg-zinc-100">
          
          {/* Badge: Premium Glass Effect */}
          <div className="absolute top-3 left-3 z-20">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white 
                          bg-zinc-900/40 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              {badge}
            </div>
          </div>

          {/* Image with Parallax-feel Scale */}
          <img
            src={banner || "/api/placeholder/600/400"}
            alt="" 
            className="h-full w-full object-cover transition-transform duration-700 cubic-bezier(0.25, 1, 0.5, 1) will-change-transform 
                       group-hover:scale-110"
          />

          {/* Subtle vignette for depth */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* External Link Icon (Floats in) */}
          <div className="absolute top-3 right-3 z-20 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
             <div className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm text-zinc-900">
                <ExternalLink className="w-3.5 h-3.5" />
             </div>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="flex flex-1 flex-col p-5">
          
          {/* Meta Tag */}
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600/90">
            <Sparkles className="w-3 h-3" />
            <span className="uppercase tracking-widest text-[10px]">Sponsored</span>
          </div>

          {/* Main Title - Larger & tighter for impact */}
          <h3 className="text-xl font-bold leading-tight text-zinc-900 mb-4
                         transition-colors duration-300 group-hover:text-blue-700">
            {title}
          </h3>

          {/* Spacer to push Footer down if needed */}
          <div className="flex-1" />

          {/* Active Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-dashed border-zinc-200">
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors">
              Learn more
            </span>
            
            <span className="flex items-center gap-2 text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
              Open Offer
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </a>
    </article>
  );
};

export default AdCard;