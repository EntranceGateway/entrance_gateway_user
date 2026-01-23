import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Brain } from "lucide-react";
import { getCourses } from "../../../http/course";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { DEFAULT_PAGE_SIZE } from "../../../constants/pagination";
import ResourceImage from "../../../components/common/ResourceViewer/ResourceImage";
import bookImage from "../../../../src/assets/book.jpg";



const LEVEL_CONFIG = {
  "BACHELOR": { label: "Bachelor", color: "bg-brand-blue/90" },
  "PLUS_TWO": { label: "Plus Two", color: "bg-brand-blue/90" },
  "MASTERS": { label: "Masters", color: "bg-brand-blue/90" },
  "default": { label: "Course", color: "bg-brand-blue/90" },
};

const ICON_CONFIG = {
  "BCA": { icon: "computer", color: "bg-blue-50 text-blue-500" },
  "CSIT": { icon: "code", color: "bg-green-50 text-green-500" },
  "Management": { icon: "school", color: "bg-orange-50 text-orange-500" },
  "default": { icon: "school", color: "bg-gray-50 text-gray-500" },
};

const normalizeCourses = (data) =>
  data.map((course) => {
    const college = course.collegeResponses?.[0] || {};
    return {
      id: course.courseId,
      name: course.courseName,
      description: course.description,
      affiliation: course.affiliation || college.affiliation || "TRIBHUVAN_UNIVERSITY",
      collegeName: college.collegeName || "Main Campus",
      level: course.courseLevel || "BACHELOR",
      type: course.courseType || "SEMESTER",
      duration: course.duration || "4 Years",
      collegeLogos: course.collegeResponses?.map(c => c.logoName).filter(Boolean) || [],
    };
  });

const getAffiliationLabel = (aff) => {
  const map = {
    "TRIBHUVAN_UNIVERSITY": "Tribhuvan University",
    "POKHARA_UNIVERSITY": "Pokhara University",
    "NEB": "NEB",
    "KATHMANDU_UNIVERSITY": "Kathmandu University",
  };
  return map[aff] || aff;
};

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const levelConfig = LEVEL_CONFIG[course.level] || LEVEL_CONFIG.default;
  const iconConfig = ICON_CONFIG[course.name] || ICON_CONFIG.default;
  // Use book image for all courses
  const image = bookImage;
  
  // Get first college logo if available
  const collegeLogoFileName = course.collegeLogos?.[0];

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all group h-full flex flex-col hover:-translate-y-1 duration-300 cursor-pointer"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={image} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 ${levelConfig.color} backdrop-blur text-[10px] font-bold uppercase tracking-wide rounded-full text-white shadow-sm border border-white/20`}>
            {levelConfig.label}
          </span>
        </div>
        {collegeLogoFileName && (
          <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-lg shadow-lg p-1.5 flex items-center justify-center">
            <ResourceImage
              fileName={collegeLogoFileName}
              alt={`${course.collegeName} logo`}
              className="w-full h-full object-contain"
              fallback={null}
            />
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-display font-bold text-xl drop-shadow-md">{course.name}</h3>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-gray-500 mb-3">
          <span className={`material-icons-round text-lg ${iconConfig.color.split(" ")[1]}`}>account_balance</span>
          <span className="text-xs font-semibold tracking-wide uppercase">{getAffiliationLabel(course.affiliation)}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
          {course.description || `${course.name} provides students with comprehensive knowledge and practical skills for career growth.`}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-400">{course.duration}</span>
          <span 
            onClick={(e) => e.stopPropagation()}
            className="bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
          >
            View Details <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

const FilterSidebar = ({ filters, setFilters, onReset }) => {
  const [levelOpen, setLevelOpen] = useState(true);
  const [affOpen, setAffOpen] = useState(true);

  const levelOptions = [
    { value: "BACHELOR", label: "Bachelor" },
    { value: "PLUS_TWO", label: "Plus Two" },
    { value: "MASTERS", label: "Masters" },
  ];

  const affOptions = [
    { value: "TRIBHUVAN_UNIVERSITY", label: "Tribhuvan University" },
    { value: "POKHARA_UNIVERSITY", label: "Pokhara University" },
    { value: "NEB", label: "NEB" },
  ];

  const toggleFilter = (key, value) => {
    const current = filters[key] || [];
    setFilters({
      ...filters,
      [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    });
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-brand-navy">Filters</h2>
          <button onClick={onReset} className="text-xs font-bold text-gray-400 hover:text-brand-blue uppercase tracking-wider">Reset</button>
        </div>

        <div className="mb-8">
          <button onClick={() => setLevelOpen(!levelOpen)} className="flex justify-between items-center w-full mb-4">
            <span className="text-sm font-bold text-gray-700">Course Level</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${levelOpen ? "rotate-180" : ""}`} />
          </button>
          {levelOpen && (
            <div className="space-y-3">
              {levelOptions.map((opt) => (
                <label key={opt.value} className="flex items-center group cursor-pointer">
                  <input type="checkbox" checked={filters.levels?.includes(opt.value)} onChange={() => toggleFilter("levels", opt.value)} className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4" />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-brand-navy">{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <button onClick={() => setAffOpen(!affOpen)} className="flex justify-between items-center w-full mb-4">
            <span className="text-sm font-bold text-gray-700">Affiliation</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${affOpen ? "rotate-180" : ""}`} />
          </button>
          {affOpen && (
            <div className="space-y-3">
              {affOptions.map((opt) => (
                <label key={opt.value} className="flex items-center group cursor-pointer">
                  <input type="checkbox" checked={filters.affiliations?.includes(opt.value)} onChange={() => toggleFilter("affiliations", opt.value)} className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4" />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-brand-navy">{opt.label}</span>
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
          <p className="text-xs text-gray-500 mb-3">Our counselors can help you choose the right path.</p>
          <Link to="/contact" className="text-brand-blue text-xs font-bold flex items-center gap-1 hover:underline">
            Talk to an Expert <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ levels: [], affiliations: ["TRIBHUVAN_UNIVERSITY"] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = DEFAULT_PAGE_SIZE / 2;

  useEffect(() => {
    setLoading(true);
    getCourses()
      .then(({ items }) => {
        const normalized = normalizeCourses(items);
        setCourses(normalized);
        setFiltered(normalized);
      })
      .catch((err) => console.error("Failed to load courses:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = courses;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    }

    if (filters.levels?.length > 0) {
      result = result.filter((c) => filters.levels.includes(c.level));
    }

    if (filters.affiliations?.length > 0) {
      result = result.filter((c) => filters.affiliations.includes(c.affiliation));
    }

    setFiltered(result);
    setPage(1);
  }, [filters, courses, searchQuery]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);

  const handleReset = () => setFilters({ levels: [], affiliations: [] });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <header className="mb-10">
            <h1 className="text-4xl font-display font-bold text-brand-navy mb-3">Academic Programs</h1>
            <p className="text-gray-600 text-lg">Find the right degree and pave your future career path in Nepal.</p>
          </header>

          <div className="mb-12">
            <div className="relative flex items-center max-w-3xl">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none text-gray-700"
                placeholder="Search for degrees, courses (e.g. BCA, Management)..."
              />
              <button className="absolute right-2 bg-brand-blue hover:bg-secondary text-white font-bold py-2.5 px-8 rounded-lg transition-colors">Search</button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <FilterSidebar filters={filters} setFilters={setFilters} onReset={handleReset} />

            <div className="flex-grow">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500 text-sm">
                  Showing <span className="font-bold text-gray-900">{filtered.length}</span> courses
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                      <option>Relevance</option>
                      <option>Popularity</option>
                      <option>Newest</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
                      <div className="h-48 bg-gray-200" />
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No courses found matching your filters.</p>
                  <button onClick={handleReset} className="mt-4 text-brand-blue font-medium hover:underline">Clear filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginated.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page <span className="font-bold text-gray-900">{page}</span> of {totalPages}
                  </span>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}