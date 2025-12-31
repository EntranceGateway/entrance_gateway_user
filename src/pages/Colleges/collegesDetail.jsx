import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AFFILIATION_LABELS = {
  TRIBHUVAN_UNIVERSITY: 'Tribhuwan University',
  KATHMANDU_UNIVERSITY: 'Kathmandu University',
  POKHARA_UNIVERSITY: 'Pokhara University',
  PURWANCHAL_UNIVERSITY: 'Purbanchal University',
  LUMBINI_UNIVERSITY: 'Lumbini University',
  MID_WESTERN_UNIVERSITY: 'Mid Western University',
  FAR_WESTERN_UNIVERSITY: 'Far Western University',
  CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY: 'Foreign Affiliated Campus',
};

const CollegeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await fetch(`http://185.177.116.173:8080/api/v1/colleges/${id}`);
        if (!response.ok) throw new Error('College details could not be found');
        const result = await response.json();
        setCollege(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error || !college) return <ErrorState error={error} navigate={navigate} />;

  // Map URL construction
  const mapQuery = encodeURIComponent(`${college.collegeName} ${college.location}`);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${mapQuery}`;
  // Fallback if no API key: 
  const fallbackMapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-100">
      {/* Top Navigation Bar */}
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
          
          {/* LEFT: CONTENT (8 Columns) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Hero Section */}
            <section className="relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-md border border-blue-100">
                  {college.collegeType}
                </span>
                <span className="text-slate-400 text-sm font-medium">Est. {college.establishedYear}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                {college.collegeName}
              </h1>
              
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200">
                <img 
                  src={`https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop`} 
                  alt="College" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  <span className="font-semibold">{college.location}</span>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                About Institution
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg italic font-light">
                {college.description || "The institution provides high-quality education and fosters a learning environment conducive to personal and professional growth."}
              </p>
            </section>

            {/* Map Section */}
            <section className="space-y-6">
              <div className="flex items-end justify-between px-2">
                <h3 className="text-2xl font-black tracking-tight">Campus Location</h3>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} 
                  target="_blank" rel="noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline underline-offset-4"
                >
                  GET DIRECTIONS
                </a>
              </div>
              <div className="h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-inner border border-slate-100 relative">
                <iframe
                  title="Campus Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(0.2)' }}
                  src={fallbackMapUrl}
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          </div>

          {/* RIGHT: SIDEBAR (4 Columns) */}
          <div className="lg:col-span-4 lg:mt-32">
            <div className="sticky top-28 space-y-6">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">
                  Institutional Profile
                </h4>
                
                <div className="space-y-8">
                  <SidebarItem 
                    label="University Affiliation" 
                    value={AFFILIATION_LABELS[college.affiliation] || college.affiliation}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                  />
                  <SidebarItem 
                    label="Contact Primary" 
                    value={college.contact}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                  />
                  <SidebarItem 
                    label="Official Inquiry" 
                    value={college.email}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                  />
                </div>

                <div className="mt-10">
                  <a 
                    href={college.website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-5 bg-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                  >
                    VISIT OFFICIAL WEBSITE
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </a>
                </div>
              </div>
              
              {/* Secondary Widget */}
              <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100">
                 <p className="text-xs font-bold text-blue-900/60 uppercase mb-2">Did you know?</p>
                 <p className="text-blue-900 font-medium text-sm">This institution is ranked in the top 10 for its affiliation type in the region.</p>
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
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-white/10 transition-colors">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-100 truncate">{value || 'Not available'}</p>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Synchronizing Data</p>
  </div>
);

const ErrorState = ({ error, navigate }) => (
  <div className="min-h-screen flex items-center justify-center p-6 text-center bg-white">
    <div className="max-w-md">
      <h2 className="text-6xl font-black text-slate-100 mb-4 tracking-tighter">404</h2>
      <p className="text-slate-500 mb-8 font-medium">{error || 'Unable to locate the college details in our database.'}</p>
      <button onClick={() => navigate(-1)} className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold hover:scale-105 transition-transform">
        GO BACK
      </button>
    </div>
  </div>
  
);

export default CollegeDetailPage;