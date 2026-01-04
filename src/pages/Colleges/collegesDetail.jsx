// src/pages/CollegeDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

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

// Default fallback URLs
const DEFAULT_LOGO = 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&q=80&w=800&auto=format&fit=crop&crop=center';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1523050854058-8df9a35d6c18?ixlib=rb-4.0.3&q=80&w=1200&auto=format&fit=crop';

const GOOGLE_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY_HERE';
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY_HERE';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [campusImage, setCampusImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://185.177.116.173:8080/api/v1/colleges/${id}`);
        if (!response.ok) throw new Error('College not found');

        const result = await response.json();
        setCollege(result.data);
      } catch (err) {
        setError(err.message || 'Failed to load college details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCollege();
  }, [id]);

  // Campus hero image (Google/Unsplash fallback)
  useEffect(() => {
    if (!college) return;

    const fetchCampusImage = async () => {
      setImageLoading(true);
      const query = encodeURIComponent(`${college.collegeName} ${college.location} Nepal campus`);

      try {
        if (GOOGLE_API_KEY && GOOGLE_API_KEY !== 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
          const placeRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_API_KEY}`
          );
          const placeData = await placeRes.json();
          if (placeData.results?.[0]?.photos?.[0]?.photo_reference) {
            const photoRef = placeData.results[0].photos[0].photo_reference;
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1920&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`;
            setCampusImage(photoUrl);
            setImageLoading(false);
            return;
          }
        }

        if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'YOUR_UNSPLASH_ACCESS_KEY_HERE') {
          const unsplashRes = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
          );
          const unsplashData = await unsplashRes.json();
          if (unsplashData.results?.[0]?.urls?.full) {
            setCampusImage(unsplashData.results[0].urls.full);
            setImageLoading(false);
            return;
          }
        }

        setCampusImage(DEFAULT_IMAGE);
      } catch (err) {
        setCampusImage(DEFAULT_IMAGE);
      } finally {
        setImageLoading(false);
      }
    };

    fetchCampusImage();
  }, [college]);

  const mapQuery = college ? encodeURIComponent(`${college.collegeName} ${college.location} Nepal`) : '';
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const getWebsiteUrl = (url) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  // Build full image URLs (assuming served from your backend)
  const getImageUrl = (filename) => {
    if (!filename) return DEFAULT_IMAGE;
    return `http://185.177.116.173:8080/uploads/colleges/${filename}`;
  };

  const getLogoUrl = (filename) => {
    if (!filename) return DEFAULT_LOGO;
    return `http://185.177.116.173:8080/uploads/colleges/${filename}`;
  };

  if (loading) return <LoadingSkeleton />;
  if (error || !college) return <ErrorState error={error} navigate={navigate} />;

  const hasCourses = college.courses && college.courses.length > 0;
  const hasImages = college.collegePictureName && college.collegePictureName.length > 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              BACK TO DIRECTORY
            </button>
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admissions Open</span>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left: Main Content */}
            <div className="lg:col-span-8 space-y-12">

              {/* Hero with Logo */}
              <section>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white flex-shrink-0">
                    <img
                      src={getLogoUrl(college.logoName)}
                      alt={`${college.collegeName} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.src = DEFAULT_LOGO; }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-md border border-blue-100">
                        {college.collegeType === 'PRIVATE' ? 'Private' : college.collegeType || 'Community'}
                      </span>
                      <span className="text-slate-400 text-sm font-medium">Est. {college.establishedYear}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                      {college.collegeName}
                    </h1>
                  </div>
                </div>

                {/* Hero Campus Image */}
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={campusImage}
                    alt={`${college.collegeName} campus`}
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setImageLoading(false)}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="font-semibold">{college.location}</span>
                  </div>
                </div>
              </section>

              {/* College Images Gallery */}
              {hasImages && (
                <section className="space-y-6">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                    Campus Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {college.collegePictureName.map((imgName, index) => (
                      <div key={index} className="aspect-video rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <img
                          src={getImageUrl(imgName)}
                          alt={`Campus view ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* About */}
              <section className="bg-white rounded-4xl p-10 border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                  About Institution
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg font-light">
                  {college.description || 'This institution is committed to excellence in education, offering modern facilities and a vibrant learning environment.'}
                </p>
              </section>

              {/* Programs Offered */}
              <section className="space-y-6">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                  Programs Offered
                </h3>
                {hasCourses ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {college.courses.map((course) => (
                      <div
                        key={course.courseId}
                        onClick={() => handleCourseClick(course.courseId)}
                        className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 cursor-pointer transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {course.courseName}
                          </h4>
                          <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <p className="text-slate-600 text-sm mb-4">
                          {course.description || 'A comprehensive program focused on academic excellence and practical skills.'}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                            {course.courseLevel || 'Bachelor'}
                          </span>
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                            {course.courseType || 'Semester'}
                          </span>
                          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
                            {AFFILIATION_LABELS[course.affiliation] || course.affiliation}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-10 text-center border border-slate-200">
                    <p className="text-slate-500 text-lg">No course information available at this time.</p>
                  </div>
                )}
              </section>

              {/* Map */}
              <section className="space-y-6">
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-black tracking-tight">Campus Location</h3>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">
                    GET DIRECTIONS →
                  </a>
                </div>
                <div className="h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-inner border border-slate-100">
                  <iframe title="Campus map" width="100%" height="100%" style={{ border: 0 }} src={mapEmbedUrl} allowFullScreen loading="lazy" />
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 lg:mt-32">
              <div className="sticky top-28 space-y-6">
                <div className="bg-slate-900 rounded-24xl p-8 text-white shadow-xl">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">
                    Institutional Profile
                  </h4>

                  <div className="space-y-8">
                    <SidebarItem
                      label="University Affiliation"
                      value={AFFILIATION_LABELS[college.affiliation] || college.affiliation || 'N/A'}
                      icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                    />
                    <SidebarItem
                      label="Contact Number"
                      value={college.contact || 'Not available'}
                      icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                    />
                    <SidebarItem
                      label="Email Address"
                      value={college.email || 'Not available'}
                      icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    />
                  </div>

                  {/* Only Website Button */}
                  {college.website && (
                    <div className="mt-10">
                      <a
                        href={getWebsiteUrl(college.website)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-5 bg-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        VISIT OFFICIAL WEBSITE
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 rounded-2fxl p-8 border border-blue-100">
                  <p className="text-xs font-bold text-blue-900/60 uppercase mb-2">Quick Fact</p>
                  <p className="text-blue-900 font-medium text-sm">
                    Affiliated with {AFFILIATION_LABELS[college.affiliation] || 'a leading university'} since {college.establishedYear}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

const SidebarItem = ({ label, value, icon }) => (
  <div className="flex gap-4 group">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-white/10 transition-all">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-100 truncate">{value}</p>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading College Details</p>
  </div>
);

const ErrorState = ({ error, navigate }) => (
  <div className="min-h-screen flex items-center justify-center p-6 text-center bg-white">
    <div className="max-w-md">
      <h2 className="text-6xl font-black text-slate-100 mb-4 tracking-tighter">404</h2>
      <p className="text-slate-500 mb-8 font-medium">{error || 'College not found in our directory.'}</p>
      <button onClick={() => navigate('/colleges')} className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold hover:scale-105 transition">
        BROWSE COLLEGES
      </button>
    </div>
  </div>
);

export default CollegeDetailPage;