import AdsPanel from "./AdsPanel";
import Footer from "./Footer";
import Navbar from "./Navbar";

const DashboardLayout = ({ children, showAds = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 box-border">

      {/* Full-width Navbar */}
      <div className="w-full box-border">
        <Navbar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 w-full box-border">
        <div className="flex flex-1 gap-0 box-border">

          {/* MAIN CONTENT */}
          <main className="flex-1 bg-white shadow rounded-lg p-6 box-border">
            {children}
          </main>

          {/* ADS PANEL — only render if enabled */}
          {showAds && (
            <aside className="hidden lg:block w-64 box-border">
              <AdsPanel />
            </aside>
          )}

        </div>
      </div>

      {/* Full-width Footer */}
      <div className="w-full box-border">
        <Footer />
      </div>

    </div>
  );
};

export default DashboardLayout;
