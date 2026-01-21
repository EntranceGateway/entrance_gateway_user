import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

function TrainingCard({ training }) {
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const firstLetter = training.trainingName?.charAt(0)?.toUpperCase() || "T";

  return (
    <Link
      to={`/training/${training.trainingId}`}
      className={`
        group relative flex flex-col bg-white dark:bg-gray-950 
        border border-gray-200/60 dark:border-gray-800 rounded-3xl 
        overflow-hidden shadow-xl hover:shadow-2xl 
        hover:-translate-y-4 transition-all duration-500 ease-out
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
        h-full
      `}
    >
      {/* Header – Vibrant orange gradient + massive first letter */}
      <div className="relative h-56 bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 overflow-hidden">
        {/* Depth & mood overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 group-hover:from-black/25 transition-all duration-700" />

        {/* Huge first letter – warm glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={`
              text-[11rem] md:text-[13rem] lg:text-[15rem] font-black 
              text-white/18 dark:text-white/12 tracking-[-0.06em] 
              select-none drop-shadow-2xl
              group-hover:text-orange-300/40 group-hover:scale-110 group-hover:rotate-[3deg]
              transition-all duration-1000 ease-out
            `}
          >
            {firstLetter}
          </span>
        </div>

        {/* Glassmorphism category badge – orange accent */}
        <span
          className={`
            absolute top-6 left-6 z-10 
            bg-white/85 dark:bg-gray-900/75 backdrop-blur-xl 
            text-orange-800 dark:text-orange-300 
            text-xs font-extrabold px-5 py-2 rounded-full 
            shadow-xl border border-white/40 dark:border-orange-500/30
            uppercase tracking-widest
          `}
        >
          {training.trainingCategory || "Training"}
        </span>
      </div>

      {/* Content area */}
      <div className="p-7 flex flex-col flex-grow">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50 mb-4 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-400">
          {training.trainingName}
        </h3>

        <div className="flex items-center text-gray-600 dark:text-gray-400 text-base mb-8">
          <Calendar className="w-5 h-5 mr-3 text-orange-500 flex-shrink-0" />
          <span className="font-semibold">
            {formatDate(training.startDate)} – {formatDate(training.endDate)}
          </span>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100/70 dark:border-gray-800/50 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-orange-500" />
            Module / Path
          </span>

          <div className="flex items-center text-orange-600 dark:text-orange-400 text-base font-bold">
            <span className="group-hover:translate-x-2 transition-transform duration-400">
              Start Learning
            </span>
            <ArrowRight className="w-5 h-5 ml-3 transform group-hover:translate-x-3 transition-transform duration-400" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TrainingCard;