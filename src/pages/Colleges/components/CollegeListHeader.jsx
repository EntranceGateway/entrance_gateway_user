import { Search } from 'lucide-react';

export function CollegeListHeader({ 
  searchTerm, 
  onSearchChange, 
  onSearch,
  isLoading 
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.();
    }
  };

  return (
    <div className="mb-10">
      <header className="mb-10">
        <h1 className="text-4xl font-display font-bold text-brand-navy mb-3">Featured Institutes</h1>
        <p className="text-gray-600 text-lg">Discover premier campuses with world-class infrastructure and academic excellence.</p>
      </header>

      <div className="mb-12">
        <div className="relative flex items-center max-w-3xl">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Search for colleges, institutes (e.g. Engineering, Medical)..."
            className="w-full pl-12 pr-32 py-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none text-gray-700"
          />
          <button 
            onClick={onSearch}
            disabled={isLoading}
            className="absolute right-2 bg-brand-blue hover:bg-secondary text-white font-bold py-2.5 px-8 rounded-lg transition-colors disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
