import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getSingleCourse, getCourseSyllabus } from '../../http/course';
import {
  CourseDetailHero,
  CourseStats,
  CourseOverview,
  AdmissionRequirements,
  TopColleges,
  GuidanceCard,
} from './components';

function LoadingState() {
  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-brand-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading course details...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ErrorState({ error, onBack }) {
  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="material-icons-round text-red-600 text-3xl sm:text-4xl">error_outline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Course Not Found</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            {error || 'The course you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={onBack}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-navy transition text-sm sm:text-base"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseData = await getSingleCourse(id);
        if (!courseData) throw new Error('Course not found');
        setCourse(courseData);

        try {
          const syllabusData = await getCourseSyllabus(id);
          setSyllabus(syllabusData);
        } catch {
          setSyllabus(null);
        }
      } catch (err) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourseData();
  }, [id]);

  const handleEnquiry = () => {
    navigate('/contact');
  };

  const handleRequestCallback = () => {
    navigate('/contact');
  };

  if (loading) return <LoadingState />;
  if (error || !course) return <ErrorState error={error} onBack={() => navigate('/courses')} />;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <CourseDetailHero course={course} onEnquiry={handleEnquiry} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <CourseOverview course={course} description={course?.description} />
              <AdmissionRequirements criteria={course?.criteria} />
              
              {syllabus && Object.keys(syllabus).length > 0 && (
                <section className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-5 sm:mb-6 flex items-center gap-2">
                    <span className="material-icons-round text-brand-blue">menu_book</span>
                    Course Syllabus
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    {Object.keys(syllabus).map((year) =>
                      Object.keys(syllabus[year]).map((sem) => (
                        <div key={`${year}-${sem}`} className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3 sm:gap-4 mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center font-bold text-sm sm:text-base">
                              {sem}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Year {year}, Semester {sem}</h3>
                              <p className="text-xs sm:text-sm text-gray-500">{syllabus[year][sem].length} subjects</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {syllabus[year][sem].map((sub, i) => (
                              <div key={i} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg border border-gray-100">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-blue rounded-full flex-shrink-0" />
                                <span className="text-gray-700 text-xs sm:text-sm">{sub}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}

              {course?.collegeResponses?.length > 0 && (
                <section className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-5 sm:mb-6 flex items-center gap-2">
                    <span className="material-icons-round text-brand-blue">apartment</span>
                    Affiliated Colleges ({course.collegeResponses.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {course.collegeResponses.slice(0, 6).map((college) => (
                      <div
                        key={college.collegeId}
                        onClick={() => navigate(`/colleges/${college.collegeId}`)}
                        className="group bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100 hover:border-brand-blue hover:shadow-md cursor-pointer transition-all"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-brand-navy flex items-center justify-center flex-shrink-0">
                            {college.imageUrl ? (
                              <img
                                src={college.imageUrl}
                                alt={college.collegeName}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="font-bold text-white text-xs">
                                {college.collegeName?.split(' ').map(w => w[0]).slice(0, 3).join('').toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-brand-blue transition-colors line-clamp-2 mb-1">
                              {college.collegeName}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                              <span className="material-icons-round text-sm">location_on</span>
                              {college.location || 'Nepal'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {course.collegeResponses.length > 6 && (
                    <div className="mt-4 sm:mt-6 text-center">
                      <button
                        onClick={() => navigate('/colleges')}
                        className="text-brand-blue font-semibold text-sm hover:underline"
                      >
                        View all {course.collegeResponses.length} colleges →
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6 lg:space-y-8">
              <div className="lg:sticky lg:top-24 space-y-6 lg:space-y-8">
                <CourseStats course={course} />
                <TopColleges colleges={course?.collegeResponses} />
                <GuidanceCard onRequestCallback={handleRequestCallback} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
