import { useState, useEffect } from "react";
import { getUserDetail, updateUserProfile } from "../../http/userDetail";
import { changePassword } from "../../http/userApi";
import Navbar from "../../components/layout/Navbar";
import {
  ProfileSidebar,
  ProfileHeader,
  EditProfileForm,
  SecurityForm,
  SuccessAlert,
  ErrorAlert,
  MobileTabNav,
} from "./components";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserDetail();
        setUser(userData);
      } catch (error) {
        setErrorMessage("Failed to load profile data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await updateUserProfile(formData);
      setUser(response.data);
      setSuccessMessage("Profile updated successfully!");
      setActiveTab("profile");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile.";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await changePassword(formData);
      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password.";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col antialiased">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-10 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Tab Navigation */}
          <MobileTabNav activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden md:block">
              <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Content Area */}
            <div className="flex-grow space-y-6">
              {/* Success/Error Messages */}
              <SuccessAlert
                message={successMessage}
                onClose={() => setSuccessMessage("")}
              />
              <ErrorAlert
                message={errorMessage}
                onClose={() => setErrorMessage("")}
              />

              {/* Profile View */}
              {activeTab === "profile" && <ProfileHeader user={user} />}

              {/* Edit Profile */}
              {activeTab === "edit" && (
                <EditProfileForm
                  user={user}
                  onSubmit={handleProfileUpdate}
                  isLoading={isSubmitting}
                />
              )}

              {/* Security & Password */}
              {activeTab === "security" && (
                <SecurityForm
                  onSubmit={handlePasswordChange}
                  isLoading={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="material-symbols-outlined text-brand-gold text-2xl">
                school
              </span>
              <span className="font-bold text-lg tracking-tight">
                EntranceGateway
              </span>
              <span className="mx-2 text-white/30">|</span>
              <span className="text-sm text-gray-300">
                User Account Management
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">
                Help Center
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 flex justify-between items-center">
            <p className="text-xs text-gray-400">
              © 2024 EntranceGateway Education Pvt. Ltd., Nepal.
            </p>
            <div className="text-xs text-gray-500">System Version: 2.4.1</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
