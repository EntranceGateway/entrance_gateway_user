// src/pages/CollegeDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://185.177.116.173:8080/api/v1/colleges/${id}`)
      .then(res => res.json())
      .then(data => setCollege(data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!college) return <div className="p-8 text-center text-red-600">College not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link to="/colleges" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Colleges
      </Link>
      <h1 className="text-4xl font-bold mb-4">{college.collegeName}</h1>
      {/* Add more details here */}
      <p>{college.address}</p>
      {/* Display courses, contact, images, etc. */}
    </div>
  );
};

export default CollegeDetailPage;