// src/components/cards/AdCard.jsx
import React from 'react';
import { ExternalLink, Zap, ArrowRight, Sparkles } from 'lucide-react';

const Card = ({ 
  title, 
  description, 
  banner, 
  bannerUrl, 
  badge = "Featured Offer" 
}) => {
  return (
    <article className="h-full w-full max-w-sm mx-auto">
      <a
        href={bannerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col h-full overflow-hidden rounded-[1.25rem] bg-white 
                   border border-zinc-200/60 shadow-sm
                   transition-all duration-500 ease-out
                   hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1.5
                   focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
        aria-label={`Sponsored advertisement: ${title}`}
      >
        {/* --- Image Container --- */}
        <div className="relative w-full aspect-4/3 overflow-hidden bg-zinc-100">
          
          {/* Badge: Glassmorphism Style */}
          <div className="absolute top-3 left-3 z-20">
            <div className="flex items-center gap-1.5 px-3 py-1.5 pr-4 text-[11px] font-bold uppercase tracking-wider text-white 
                          bg-black/30 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              {badge}
            </div>
          </div>

          {/* Main Image with Zoom Effect */}
          <img
            src={banner || "/api/placeholder/600/400"}
            alt="" 
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out will-change-transform 
                       group-hover:scale-105"
          />

          {/* Gradient Overlay: Only visible on hover for depth */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent 
                          opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          {/* Quick Action Icon (Appears on hover) */}
          <div className="absolute bottom-4 right-4 z-20 translate-y-4 opacity-0 transition-all duration-300 
                          group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900 shadow-xl">
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* --- Content Container --- */}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          <div>
            {/* Header with Icon */}
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-600/80">
                <Sparkles className="h-3 w-3" />
                Sponsored
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-2.5 text-lg font-bold leading-tight text-zinc-900 
                           transition-colors duration-300 group-hover:text-blue-600">
              {title}
            </h3>

            {/* Description (Truncated nicely) */}
            <p className="text-sm leading-relaxed text-zinc-500 line-clamp-3">
              {description || "Unlock exclusive access to premium features today. This limited-time offer is designed to elevate your experience."}
            </p>
          </div>

          {/* CTA Footer */}
          <div className="mt-6 flex items-center pt-4 border-t border-zinc-100">
            <span className="group/btn flex items-center gap-2 text-sm font-bold text-zinc-900 
                             transition-all duration-300 group-hover:text-blue-600">
              Check it out
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </span>
          </div>
        </div>
      </a>
    </article>
  );
};

export default Card;