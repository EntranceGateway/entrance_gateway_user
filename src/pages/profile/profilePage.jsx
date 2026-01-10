import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Heart,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  Shield,
  Edit3,
  X,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getUserDetail, updateUserProfile } from "../../http/userDetail";

// Interest options
const interestOptions = [
  "Engineering",
  "Medical",
  "Management",
  "Law",
  "Agriculture",
  "Science",
  "Arts",
  "Commerce",
  "IT/Computer Science",
  "Other",
];

// Qualification options
const qualificationOptions = [
  "SEE/SLC",
  "+2/Intermediate",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Other",
];

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    address: "",
    dob: "",
    interested: "",
    latestQualification: "",
    role: "",
  });

  const [originalData, setOriginalData] = useState({});

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserDetail();
        
        const profileData = {
          fullname: userData?.fullname || userData?.name || "",
          email: userData?.email || "",
          contact: userData?.contact || userData?.phone || "",
          address: userData?.address || "",
          dob: userData?.dob ? userData.dob.split("T")[0] : "",
          interested: userData?.interested || "",
          latestQualification: userData?.latestQualification || "",
          role: userData?.role || "student",
        };
        
        setFormData(profileData);
        setOriginalData(profileData);
      } catch (error) {
        setErrorMessage("Failed to load profile data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Prepare update data (excluding password if not changing)
      const updateData = {
        fullname: formData.fullname,
        email: formData.email, // Required but hidden
        contact: formData.contact,
        address: formData.address,
        dob: formData.dob,
        interested: formData.interested,
        latestQualification: formData.latestQualification,
        role: formData.role,
      };

      await updateUserProfile(updateData);
      
      setOriginalData(formData);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to update profile.";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative bg-linear-to-br from-orange-600 via-orange-500 to-amber-500 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                  <span className="text-4xl md:text-5xl font-bold text-white">
                    {getInitials(formData.fullname)}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition">
                  <Camera className="w-5 h-5 text-orange-600" />
                </button>
              </motion.div>

              {/* User Info */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center md:text-left"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {formData.fullname || "Welcome!"}
                </h1>
                <p className="text-white/80 text-lg mb-3">{formData.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm">
                    <Shield className="w-4 h-4" />
                    {formData.role || "Student"}
                  </span>
                  {formData.interested && (
                    <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm">
                      <Heart className="w-4 h-4" />
                      {formData.interested}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Edit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="md:ml-auto"
              >
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition shadow-lg"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition border border-white/30"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 -mt-6">
          {/* Success/Error Messages */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
              <p className="text-red-800 font-medium">{errorMessage}</p>
            </motion.div>
          )}

          {/* Profile Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 md:px-8 py-5">
              <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
              <p className="text-gray-500 text-sm mt-1">
                {isEditing ? "Update your personal details below" : "Your personal details"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {/* Hidden Email Field */}
              <input type="hidden" name="email" value={formData.email} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border rounded-xl transition ${
                      isEditing
                        ? "border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        : "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Email (Read-only Display) */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email Address
                    <span className="text-xs text-gray-400 ml-auto">(Cannot be changed)</span>
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {formData.email}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="98XXXXXXXX"
                    className={`w-full px-4 py-3 border rounded-xl transition ${
                      isEditing
                        ? "border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        : "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition ${
                      isEditing
                        ? "border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        : "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    className={`w-full px-4 py-3 border rounded-xl transition ${
                      isEditing
                        ? "border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        : "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Field of Interest */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Heart className="w-4 h-4 text-gray-400" />
                    Field of Interest
                  </label>
                  <select
                    name="interested"
                    value={formData.interested}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition ${
                      isEditing
                        ? "border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        : "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <option value="">Select your interest</option>
                    {interestOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Latest Qualification */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    Latest Qualification
                  </label>
                  <select
                    name="latestQualification"
                    value={formData.latestQualification}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition ${
                      isEditing
                        ? "border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        : "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <option value="">Select your qualification</option>
                    {qualificationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex flex-col sm:flex-row gap-4"
                >
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-linear-to-r from-orange-600 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="sm:w-auto px-8 py-4 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Security Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mt-6"
          >
            <div className="bg-gray-50 border-b border-gray-100 px-6 md:px-8 py-5">
              <h2 className="text-xl font-bold text-gray-800">Security</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your account security</p>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Password</h3>
                    <p className="text-gray-500 text-sm">Last changed: Never</p>
                  </div>
                </div>
                <a
                  href="/change-password"
                  className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition"
                >
                  Change Password
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
