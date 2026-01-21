// src/components/CollegeCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CollegeCard = ({ college }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/colleges/${college.collegeId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden 
                 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    >
      {college.imageUrl ? (
        <img
          src={college.imageUrl}
          alt={college.collegeName}
          className="w-full h-48 object-cover"
          onError={(e) => (e.target.src = '/placeholder-college.jpg')} // fallback
        />
      ) : (
        <div className="w-full h-48 bg-linear-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
          <span className="text-2xl font-bold text-indigo-600">{college.collegeName.charAt(0)}</span>
        </div>
      )}

      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">
          {college.collegeName}
        </h3>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {college.address || 'Location not specified'}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {college.affiliation && (
            <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              {college.affiliation}
            </span>
          )}
          {college.province && (
            <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {college.province}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {college.courses?.length || 0} Course{college.courses?.length !== 1 ? 's' : ''}
          </span>
          <span className="text-blue-600 font-medium">View Details →</span>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;