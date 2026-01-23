import { useState } from "react";

export default function EditProfileForm({ user, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    contact: user?.contact || "",
    address: user?.address || "",
    dob: user?.dob ? user.dob.split("T")[0] : "",
    interested: user?.interested || "",
    latestQualification: user?.latestQualification || "",
  });

  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-roboto font-bold text-brand-navy text-lg">
            Edit Profile Information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update your personal details and preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label htmlFor="full_name">
              Full Name
              <input
                id="full_name"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your full name"
                required
              />
            </label>
            <p className="mt-1.5 text-xs text-gray-500">
              Your full name as it appears on official documents
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email">
              Email Address
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="your.email@example.com"
                required
              />
            </label>
            <p className="mt-1.5 text-xs text-gray-500">
              Used for account notifications
            </p>
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="contact">
              Contact Number
              <input
                id="contact"
                name="contact"
                type="text"
                value={formData.contact}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="98XXXXXXXX"
                required
              />
            </label>
            <p className="mt-1.5 text-xs text-gray-500">
              10-digit mobile number
            </p>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address">
              Address
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="City, District, Nepal"
                required
              />
            </label>
            <p className="mt-1.5 text-xs text-gray-500">
              Your current residential address
            </p>
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob">
              Date of Birth
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </label>
            <p className="mt-1.5 text-xs text-gray-500">
              Format: YYYY-MM-DD
            </p>
          </div>

          {/* Interested Course */}
          <div>
            <label htmlFor="interested_course">
              Interested Course
              <select
                id="interested_course"
                name="interested"
                value={formData.interested}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select Course</option>
                <option value="MBBS Entrance">MBBS Entrance</option>
                <option value="Engineering Entrance">Engineering Entrance</option>
                <option value="Nursing Entrance">Nursing Entrance</option>
                <option value="BDS Entrance">BDS Entrance</option>
              </select>
            </label>
            <p className="mt-1.5 text-xs text-gray-500">
              Your primary area of interest
            </p>
          </div>

          {/* Latest Qualification */}
          <div className="md:col-span-2">
            <label htmlFor="qualification">
              Latest Qualification
              <input
                id="qualification"
                name="latestQualification"
                type="text"
                value={formData.latestQualification}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., +2 Science, Bachelor's Degree"
              />
            </label>
            <p className="mt-1.5 text-xs text-gray-500">
              Your highest educational qualification
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-gold hover:bg-[#e6ae06] text-brand-navy px-8 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                Update Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
