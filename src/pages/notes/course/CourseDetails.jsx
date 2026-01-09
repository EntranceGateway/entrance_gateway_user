import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getSingleCourse, getCourseSyllabus } from '../../../http/course';

const AFFILIATION_LABELS = {
  TRIBHUVAN_UNIVERSITY: 'Tribhuvan University',
  KATHMANDU_UNIVERSITY: 'Kathmandu University',
  POKHARA_UNIVERSITY: 'Pokhara University',
  PURBANCHAL_UNIVERSITY: 'Purbanchal University',
  LUMBINI_UNIVERSITY: 'Lumbini University',
  MID_WESTERN_UNIVERSITY: 'Mid Western University',
  FAR_WESTERN_UNIVERSITY: 'Far Western University',
  CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY: 'Foreign Affiliated Campus',
};

const DEFAULT_COURSE_BANNER = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070';
const DEFAULT_COLLEGE_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=2064';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        const courseData = await getSingleCourse(id);
        if (!courseData) throw new Error('Course not found');
        setCourse(courseData);

        const syllabusData = await getCourseSyllabus(id);
        setSyllabus(syllabusData);
      } catch (err) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourseData();
  }, [id]);

  const criteriaPoints = course?.criteria
    ? course.criteria
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(s => s && !s.toLowerCase().includes('to study'))
        .map(s => s.charAt(0).toUpperCase() + s.slice(1) + (s.endsWith('.') ? '' : '.'))
    : [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading course details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-6">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Course Not Found</h2>
            <p className="text-slate-600 mb-8">{error || 'The course you are looking for does not exist or has been removed.'}</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
            >
              Browse All Courses
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const universityName = AFFILIATION_LABELS[course.affiliation] || course.affiliation;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section with Course Banner */}
        <div className="relative bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Left Content - 3 columns */}
              <div className="lg:col-span-3 px-8 py-12 lg:py-16">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-medium transition group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Courses
                </button>

                {/* University Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-8 0h4" />
                  </svg>
                  {universityName}
                </div>

                {/* Course Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  {course.courseName}
                </h1>

                {/* Description */}
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {course.description || 'A comprehensive program designed to build expertise and prepare students for professional success in their chosen field.'}
                </p>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Level</p>
                        <p className="text-lg font-bold text-slate-900">{course.courseLevel || 'Bachelor'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Duration</p>
                        <p className="text-lg font-bold text-slate-900">{course.courseType || 'Full Time'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Banner - 2 columns */}
              <div className="lg:col-span-2 relative h-64 lg:h-auto">
                <img
                  src={course.bannerImage || DEFAULT_COURSE_BANNER}
                  alt={course.courseName}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = DEFAULT_COURSE_BANNER)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-l"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex gap-8">
              {['overview', 'syllabus', 'colleges'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-semibold text-sm uppercase tracking-wide transition relative ${
                    activeTab === tab
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'syllabus' && 'Syllabus'}
                  {tab === 'colleges' && `Colleges (${course.collegeResponses?.length || 0})`}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Admission Requirements */}
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Admission Requirements</h2>
                </div>

                {criteriaPoints.length > 0 ? (
                  <div className="space-y-4">
                    {criteriaPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-slate-700 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-lg p-8 text-center">
                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-500">Admission criteria will be published by the university.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Syllabus Tab */}
          {activeTab === 'syllabus' && (
            <div>
              {syllabus ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">Complete Course Syllabus</h2>
                    <p className="text-slate-600 mt-1">Detailed curriculum breakdown by semester</p>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {Object.keys(syllabus).map((year) =>
                      Object.keys(syllabus[year]).map((sem) => (
                        <div key={`${year}-${sem}`} className="p-8 hover:bg-slate-50 transition">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">
                              {sem}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">Year {year}, Semester {sem}</h3>
                              <p className="text-sm text-slate-500">{syllabus[year][sem].length} subjects</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3 pl-16">
                            {syllabus[year][sem].map((sub, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <span className="text-slate-700">{sub}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Syllabus Not Available</h3>
                  <p className="text-slate-500">The detailed syllabus for this course is not currently available.</p>
                </div>
              )}
            </div>
          )}

          {/* Colleges Tab */}
          {activeTab === 'colleges' && (
            <div>
              {course.collegeResponses?.length > 0 ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Affiliated Colleges</h2>
                    <p className="text-slate-600">Explore {course.collegeResponses.length} colleges offering this program</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {course.collegeResponses.map((college) => (
                      <div
                        key={college.collegeId}
                        onClick={() => navigate(`/colleges/${college.collegeId}`)}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 cursor-pointer transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={college.imageUrl || DEFAULT_COLLEGE_IMAGE}
                            alt={college.collegeName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => (e.target.src = DEFAULT_COLLEGE_IMAGE)}
                          />
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-slate-700 rounded-full text-xs font-semibold shadow-lg">
                              {college.collegeType || 'Private'}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition line-clamp-2">
                            {college.collegeName}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {college.location || 'Nepal'}
                            </div>
                            {college.establishedYear && (
                              <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Est. {college.establishedYear}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className="text-sm text-slate-500">View Details</span>
                            <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-8 0h4" />
                  </svg>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Colleges Available</h3>
                  <p className="text-slate-500">There are currently no colleges affiliated with this course.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailPage;