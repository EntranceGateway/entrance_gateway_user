import AdsPanel from "./AdsPanel";
import Footer from "./Footer";
import Navbar from "./Navbar";

const DashboardLayout = ({ children, showAds = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Full-width Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 w-full">
        {/* Remove max-w and auto margins so it fills full width */}
        <div className="flex flex-1 gap-0">

          {/* MAIN CONTENT */}
          <main
            className={`bg-white shadow rounded-lg p-6 flex-1`}
          >
            {children}
          </main>

          {/* ADS PANEL — only render if enabled */}
          {showAds && (
            <aside className="hidden lg:block w-64">
              <AdsPanel />
            </aside>
          )}
        </div>
      </div>

      {/* Full-width Footer */}
      <div className="w-full">
        <Footer />
      </div>
      
    </div>
  );
};

export default DashboardLayout;
