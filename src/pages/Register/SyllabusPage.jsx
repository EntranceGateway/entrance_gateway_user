import { useEffect, useState } from "react";
import api from "../../http";
import { Menu, X,SearchX } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SyllabusCard from "../../components/common/NoteCard/SyllabusCard";
import UniversalFilter from "../../components/FilterSidebar/FilterSidebar";

export default function SyllabusPage() {
  const [loading, setLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [syllabi, setSyllabi] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    courseNames: ["CSIT"],
    semesters: ["1"],
    affiliations: ["TRIBHUVAN_UNIVERSITY"],
  });

  useEffect(() => {
    fetchSyllabus();
  }, [activeFilters]);

  const fetchSyllabus = async () => {
    const { courseNames, semesters, affiliations } = activeFilters;
    if (!courseNames.length || !semesters.length || !affiliations.length) {
      setSyllabi([]);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      courseNames.forEach((name) => params.append("courseName", name));
      semesters.forEach((sem) => params.append("semester", sem));
      affiliations.forEach((aff) => params.append("affiliation", aff));

      const res = await api.get("/api/v1/syllabus/by-affiliation/by-course/semester", { params });
      setSyllabi(res.data?.data?.content || []);
    } catch (err) {
      console.error("Failed to fetch syllabus:", err);
      setSyllabi([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-[1600px] mx-auto px-4 py-6 lg:py-8">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Syllabus</h1>
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="p-2 bg-white rounded-lg shadow-sm border border-slate-200"
            >
              {isFilterVisible ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Main Layout Grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* ==================== LEFT: FIXED FILTER SIDEBAR ==================== */}
            <aside 
              className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:w-80 lg:shadow-none lg:bg-transparent
                ${isFilterVisible ? "translate-x-0" : "-translate-x-full"}
              `}
            >
              {/* Internal Sticky Wrapper */}
              <div className="lg:sticky lg:top-24 h-full lg:h-[calc(100vh-120px)] flex flex-col">
                <div className="bg-white lg:border lg:border-slate-200 lg:rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
                  
                  {/* Filter Header */}
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                    <button onClick={() => setIsFilterVisible(false)} className="lg:hidden p-1">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Scrollable Filter Body */}
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <UniversalFilter
                      onFilterChange={setActiveFilters}
                      initialFilters={activeFilters}
                      showCourseName={true}
                      showSemester={true}
                      showAffiliation={true}
                    />

                    {/* Reset Button */}
                    <button
                      onClick={() => setActiveFilters({ courseNames: [], semesters: [], affiliations: [] })}
                      className="mt-6 w-full py-2.5 text-xs font-bold text-red-600 border border-red-100 rounded-xl hover:bg-red-50 transition-colors uppercase tracking-wider"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Background Overlay */}
              {isFilterVisible && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[-1] lg:hidden" onClick={() => setIsFilterVisible(false)} />
              )}
            </aside>

            {/* ==================== RIGHT: SCROLLABLE CONTENT ==================== */}
            <main className="flex-1">
              <div className="hidden lg:flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900">Syllabus Directory</h1>
                  <p className="text-slate-500 mt-1">Access and download latest course curriculums</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
                   {loading ? "Updating..." : `${syllabi.length} Results Found`}
                </div>
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100" />
                  ))}
                </div>
              ) : syllabi.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <SearchX className="text-slate-300" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">No results matched</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Adjust your filters to find the syllabus you are looking for.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {syllabi.map((syllabus) => (
                    <SyllabusCard key={syllabus.syllabusId} syllabus={syllabus} />
                  ))}                  
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}