import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export function GuidanceCard({ onRequestCallback }) {
  return (
    <div className="bg-brand-navy rounded-2xl p-5 sm:p-6 shadow-md text-white relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-brand-blue rounded-full opacity-30 blur-2xl" />
      <span className="material-icons-round absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 text-[80px] sm:text-[100px] text-white/5 rotate-12">
        support_agent
      </span>
      
      <h3 className="font-bold text-base sm:text-lg mb-2 relative z-10">Need Guidance?</h3>
      <p className="text-blue-100 text-xs sm:text-sm mb-4 sm:mb-5 relative z-10 leading-relaxed">
        Talk to our expert career counselors to find the best college fit for your future.
      </p>
      
      <button 
        onClick={onRequestCallback}
        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-colors relative z-10 flex items-center justify-center gap-2 backdrop-blur-sm"
      >
        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Request Call Back
      </button>
    </div>
  );
}
