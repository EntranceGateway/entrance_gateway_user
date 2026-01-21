import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CollegePagination({ page, totalPages, onPageChange, isLoading }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center items-center gap-4">
      <button 
        onClick={() => onPageChange(page - 1)} 
        disabled={page === 1 || isLoading} 
        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm text-gray-600">
        Page <span className="font-bold text-gray-900">{page}</span> of {totalPages}
      </span>
      <button 
        onClick={() => onPageChange(page + 1)} 
        disabled={page === totalPages || isLoading} 
        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
