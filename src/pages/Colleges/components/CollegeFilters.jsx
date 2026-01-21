import { Link } from 'react-router-dom';
import { ChevronDown, Brain, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All Institutes' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'medical', label: 'Medical' },
  { id: 'management', label: 'Management' },
  { id: 'it', label: 'IT & Computing' },
];

const LOCATIONS = [
  { id: 'kathmandu', label: 'Kathmandu' },
  { id: 'lalitpur', label: 'Lalitpur' },
  { id: 'bhaktapur', label: 'Bhaktapur' },
  { id: 'pokhara', label: 'Pokhara' },
];

export function CollegeFilters({ 
  selectedCategories = ['all'], 
  selectedLocations = [], 
  onCategoryChange,
  onLocationChange,
  onReset 
}) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);

  const handleCategoryToggle = (categoryId) => {
    if (categoryId === 'all') {
      onCategoryChange?.(['all']);
    } else {
      const newCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(c => c !== categoryId)
        : [...selectedCategories.filter(c => c !== 'all'), categoryId];
      onCategoryChange?.(newCategories.length ? newCategories : ['all']);
    }
  };

  const handleLocationToggle = (locationId) => {
    const newLocations = selectedLocations.includes(locationId)
      ? selectedLocations.filter(l => l !== locationId)
      : [...selectedLocations, locationId];
    onLocationChange?.(newLocations);
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-brand-navy">Filters</h2>
          <button 
            onClick={onReset} 
            className="text-xs font-bold text-gray-400 hover:text-brand-blue uppercase tracking-wider"
          >
            Reset
          </button>
        </div>

        <div className="mb-8">
          <button 
            onClick={() => setCategoryOpen(!categoryOpen)} 
            className="flex justify-between items-center w-full mb-4"
          >
            <span className="text-sm font-bold text-gray-700">Categories</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
          </button>
          {categoryOpen && (
            <div className="space-y-3">
              {CATEGORIES.map((category) => (
                <label key={category.id} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                  />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-brand-navy">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <button 
            onClick={() => setLocationOpen(!locationOpen)} 
            className="flex justify-between items-center w-full mb-4"
          >
            <span className="text-sm font-bold text-gray-700">Location</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${locationOpen ? "rotate-180" : ""}`} />
          </button>
          {locationOpen && (
            <div className="space-y-3">
              {LOCATIONS.map((location) => (
                <label key={location.id} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location.id)}
                    onChange={() => handleLocationToggle(location.id)}
                    className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                  />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-brand-navy">
                    {location.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2 text-brand-blue">
            <Brain className="w-5 h-5" />
            <span className="text-sm font-bold">Need Guidance?</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">Our counselors can help you choose the right college.</p>
          <Link to="/contact" className="text-brand-blue text-xs font-bold flex items-center gap-1 hover:underline">
            Talk to an Expert <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
