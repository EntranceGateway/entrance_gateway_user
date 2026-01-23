import { useState } from "react";

export default function SecurityForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { strength, label: "Fair", color: "bg-yellow-500" };
    if (strength <= 4) return { strength, label: "Good", color: "bg-blue-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-roboto font-bold text-brand-navy text-lg">
          Security & Password
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account security and authentication methods.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 max-w-xl">
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label htmlFor="current_password">
              Current Password
              <div className="relative">
                <input
                  id="current_password"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className={errors.currentPassword ? "error" : ""}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPasswords.current ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>
            {errors.currentPassword && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">error</span>
                {errors.currentPassword}
              </p>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* New Password */}
          <div>
            <label htmlFor="new_password">
              New Password
              <div className="relative">
                <input
                  id="new_password"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min. 8 characters)"
                  className={errors.newPassword ? "error" : ""}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPasswords.new ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Password strength:</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength.label === "Weak" ? "text-red-600" :
                    passwordStrength.label === "Fair" ? "text-yellow-600" :
                    passwordStrength.label === "Good" ? "text-blue-600" :
                    "text-green-600"
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            {errors.newPassword && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">error</span>
                {errors.newPassword}
              </p>
            )}
            
            <p className="mt-2 text-xs text-gray-500">
              Use 8+ characters with a mix of letters, numbers & symbols
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm_password">
              Confirm New Password
              <div className="relative">
                <input
                  id="confirm_password"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your new password"
                  className={errors.confirmPassword ? "error" : ""}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPasswords.confirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">error</span>
                {errors.confirmPassword}
              </p>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <p className="mt-1.5 text-sm text-green-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">check_circle</span>
                Passwords match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-brand-navy hover:bg-brand-blue text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Changing Password...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">lock_reset</span>
                  Change Password
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
