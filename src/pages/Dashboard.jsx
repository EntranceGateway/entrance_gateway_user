import AdCard from "../components/common/Adcard/Adcard";
import Card from "../components/common/Card";
import AdsPanel from "../components/layout/AdsPanel";
import DashboardLayout from "../components/layout/DashboardLayout";


const Dashboard = ({ showAds = false ,show=true}) => {
  return (
   
<DashboardLayout>
      

      {/* Main area */}
      <div className="flex flex-1 w-full">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-6 flex gap-6">

          {/* MAIN CONTENT */}
          <main
            className={`bg-white  p-6 
            ${showAds ? "flex-1" : "w-full"}`}
          >

            {/* 4 Horizontal Cards */}
                      {show && (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdCard
        title={"Get 50% Off Your First Month!"}
        banner={"https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA"}
        bannerUrl={"https://youtu.be/me8guS2gYyI?si=YCEz3i-w96pUBdBj"}
      />
             <Card
        title={"Get 50% Off Your First Month!"}
        banner={"https://i.pinimg.com/736x/09/47/db/0947db859f8bbec51f4f85d030c59b03.jpg"}
        bannerUrl={"https://youtu.be/me8guS2gYyI?si=YCEz3i-w96pUBdBj"}
      />
              <AdCard
        title={"Get 50% Off Your First Month!"}
        banner={"https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA"}
        bannerUrl={"https://youtu.be/me8guS2gYyI?si=YCEz3i-w96pUBdBj"}
      />
             <Card
        title={"Get 50% Off Your First Month!"}
        banner={"https://i.pinimg.com/736x/09/47/db/0947db859f8bbec51f4f85d030c59b03.jpg"}
        bannerUrl={"https://youtu.be/me8guS2gYyI?si=YCEz3i-w96pUBdBj"}
      />
      
            </div>
                      )}
          </main>

          {/* Ads Panel (Right Side) */}
          {showAds && (
            <aside className="hidden lg:block w-64">
              <AdsPanel />
            </aside>
          )}
        </div>
      </div>
</DashboardLayout>
 
  );
};

export default Dashboard;
