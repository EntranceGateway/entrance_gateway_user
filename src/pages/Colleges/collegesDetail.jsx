import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getCollegeById } from '../../http/colleges';
import { ResourceImage } from '../../components/common/ResourceViewer';
import {
  CollegeDetailHero,
  CollegeAbout,
  CollegeCoursesList,
  CollegeQuickActions,
  CollegeContactSidebar,
} from './components/detail';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&q=80&w=1200&auto=format&fit=crop';

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-spin" />
      <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400">
        Loading College Details
      </p>
    </div>
  );
}

function ErrorState({ error, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center bg-gray-50">
      <div className="max-w-md">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">College Not Found</h2>
        <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">{error || 'This college is not available in our directory.'}</p>
        <button
          onClick={onBack}
          className="px-8 sm:px-10 py-3 sm:py-4 bg-blue-900 text-white rounded-full font-bold hover:bg-blue-800 transition text-sm sm:text-base"
        >
          Browse Colleges
        </button>
      </div>
    </div>
  );
}

export default function CollegeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        setLoading(true);
        setError(null);
        const collegeData = await getCollegeById(id);
        if (!collegeData) throw new Error('College not found');
        setCollege(collegeData);
      } catch (err) {
        setError(err.message || 'Failed to load college details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCollege();
  }, [id]);

  if (loading) return <LoadingState />;
  if (error || !college) return <ErrorState error={error} onBack={() => navigate('/colleges')} />;

  return (
    <DashboardLayout fullWidth={true}>
      <div className="min-h-screen bg-gray-50">
        <CollegeDetailHero college={college} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-blue-600 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Directory
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <CollegeAbout description={college.description} />

              <CollegeCoursesList courses={college.courses} />

              <section className="lg:hidden space-y-4">
                <CollegeQuickActions />
                <CollegeContactSidebar college={college} />
              </section>
            </div>

            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <CollegeQuickActions />
                <CollegeContactSidebar college={college} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
