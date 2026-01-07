// src/pages/CollegeDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api"; // adjust path if needed

const CollegeDetailPage = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await api.get(`/api/v1/colleges/${id}`);
        setCollege(res.data.data);
      } catch (err) {
        console.error(err);
        setCollege(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!college)
    return (
      <div className="p-8 text-center text-red-600">
        College not found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link to="/colleges" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Colleges
      </Link>

      <h1 className="text-4xl font-bold mb-4">
        {college.collegeName}
      </h1>

      <p>{college.address}</p>
    </div>
  );
};

export default CollegeDetailPage;
