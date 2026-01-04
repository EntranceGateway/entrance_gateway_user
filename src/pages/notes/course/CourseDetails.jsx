// src/pages/CourseDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const AFFILIATION_LABELS = {
  TRIBHUVAN_UNIVERSITY: 'Tribhuvan University',
  KATHMANDU_UNIVERSITY: 'Kathmandu University',
  POKHARA_UNIVERSITY: 'Pokhara University',
  PURWANCHAL_UNIVERSITY: 'Purbanchal University',
  LUMBINI_UNIVERSITY: 'Lumbini University',
  MID_WESTERN_UNIVERSITY: 'Mid Western University',
  FAR_WESTERN_UNIVERSITY: 'Far Western University',
  CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY: 'Foreign Affiliated Campus',
};

const API_BASE = 'http://185.177.116.173:8080/api/v1';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch course details
        const detailsRes = await fetch(`${API_BASE}/courses/${id}`);
        if (!detailsRes.ok) throw new Error('Course not found');
        const detailsJson = await detailsRes.json();
        setCourse(detailsJson.data);

        // Fetch full syllabus
        const syllabusRes = await fetch(`${API_BASE}/courses/full-syllabus/${id}`);
        if (!syllabusRes.ok) throw new Error('Syllabus not available');
        const syllabusJson = await syllabusRes.json();
        
        // Extract syllabus object from data array (structure: [{ "1": { "1": [...], "2": [...] } }])
        const syllabusData = syllabusJson.data[0];
        setSyllabus(syllabusData);
      } catch (err) {
        setError(err.message || 'Failed to load course details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h2 className="text-6xl font-black text-slate-100 mb-4">404</h2>
            <p className="text-slate-500 mb-8 text-lg">{error || 'Course not found'}</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:scale-105 transition"
            >
              BROWSE COURSES
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#FDFDFD] py-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* Back Navigation */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-8 transition-all"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            BACK TO COURSES
          </button>

          {/* Course Header */}
          <div className="bg-white rounded-3xl shadow-lg p-10 mb-12 border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-5xl font-black text-slate-900 mb-4">{course.courseName}</h1>
                <p className="text-xl text-slate-600 max-w-3xl">{course.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm">
                  {course.courseLevel}
                </span>
                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium text-sm">
                  {course.courseType}
                </span>
                <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full font-medium text-sm">
                  {AFFILIATION_LABELS[course.affiliation] || course.affiliation}
                </span>
              </div>
            </div>
          </div>

          {/* Syllabus Table */}
          {syllabus && (
            <section className="mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-10 h-1 bg-blue-600 rounded-full"></span>
                Full Syllabus
              </h2>

              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Semester</th>
                        <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Subjects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(syllabus).map((year) => (
                        <React.Fragment key={year}>
                          {Object.keys(syllabus[year]).map((semester) => {
                            const subjects = syllabus[year][semester];
                            return (
                              <tr key={`${year}-${semester}`} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="px-8 py-6 font-semibold text-slate-800">
                                  Year {year}, Semester {semester}
                                </td>
                                <td className="px-8 py-6">
                                  <ul className="space-y-2">
                                    {subjects.map((subject, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>{subject}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Colleges Offering This Course */}
          {course.collegeResponses && course.collegeResponses.length > 0 && (
            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-10 h-1 bg-blue-600 rounded-full"></span>
                Colleges Offering {course.courseName}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {course.collegeResponses.map((college) => (
                  <div
                    key={college.collegeId}
                    onClick={() => navigate(`/colleges/${college.collegeId}`)}
                    className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-slate-100 cursor-pointer transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                      {college.collegeName}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {college.location}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                        {college.collegeType}
                      </span>
                      <span className="text-slate-500">Est. {college.establishedYear}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailPage;