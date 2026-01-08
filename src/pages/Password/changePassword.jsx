import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Key,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../http";

// Password strength checker
const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { level: "Weak", color: "red", percent: 33 };
  if (strength <= 4) return { level: "Medium", color: "yellow", percent: 66 };
  return { level: "Strong", color: "green", percent: 100 };
};

// Password requirements
const passwordRequirements = [
  { id: 1, text: "At least 8 characters", check: (p) => p.length >= 8 },
  { id: 2, text: "One uppercase letter", check: (p) => /[A-Z]/.test(p) },
  { id: 3, text: "One lowercase letter", check: (p) => /[a-z]/.test(p) },
  { id: 4, text: "One number", check: (p) => /[0-9]/.test(p) },
  {
    id: 5,
    text: "One special character (!@#$%^&*)",
    check: (p) => /[^a-zA-Z0-9]/.test(p),
  },
];

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  const { currentPassword, newPassword, confirmPassword } = formData;
  const passwordStrength = getPasswordStrength(newPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (status.type === "error") {
      setStatus({ type: null, message: "" });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Validate form before submission
  const validateForm = () => {
    if (!currentPassword) {
      setStatus({ type: "error", message: "Please enter your current password" });
      return false;
    }
    if (!newPassword) {
      setStatus({ type: "error", message: "Please enter a new password" });
      return false;
    }
    if (newPassword === currentPassword) {
      setStatus({
        type: "error",
        message: "New password must be different from current password",
      });
      return false;
    }
    if (newPassword.length < 8) {
      setStatus({
        type: "error",
        message: "Password must be at least 8 characters long",
      });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return false;
    }
    // Check all requirements
    const allRequirementsMet = passwordRequirements.every((req) =>
      req.check(newPassword)
    );
    if (!allRequirementsMet) {
      setStatus({
        type: "error",
        message: "Password does not meet all requirements",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await api.post("/user/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200) {
        setStatus({
          type: "success",
          message: response.data?.message || "Password changed successfully!",
        });
        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password. Please try again.";

      // Handle specific error codes
      if (error.response?.status === 401) {
        setStatus({
          type: "error",
          message: "Current password is incorrect",
        });
      } else if (error.response?.status === 400) {
        setStatus({
          type: "error",
          message: errorMessage,
        });
      } else {
        setStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-orange-600 to-amber-500 px-8 py-10 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Change Password
                  </h1>
                  <p className="text-white/80 mt-1">
                    Keep your account secure with a strong password
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8">
              {/* Status Messages */}
              {status.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                    status.type === "success"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${
                        status.type === "success"
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {status.type === "success" ? "Success!" : "Error"}
                    </p>
                    <p
                      className={`text-sm ${
                        status.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {status.message}
                    </p>
                    {status.type === "success" && (
                      <p className="text-sm text-green-600 mt-1">
                        Redirecting to dashboard...
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={currentPassword}
                      onChange={handleChange}
                      placeholder="Enter your current password"
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      New Password
                    </span>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={newPassword}
                      onChange={handleChange}
                      placeholder="Enter your new password"
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3"
                    >
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Password Strength</span>
                        <span
                          className={`font-medium ${
                            passwordStrength.color === "red"
                              ? "text-red-600"
                              : passwordStrength.color === "yellow"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {passwordStrength.level}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength.percent}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-full rounded-full ${
                            passwordStrength.color === "red"
                              ? "bg-red-500"
                              : passwordStrength.color === "yellow"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your new password"
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
                        confirmPassword && confirmPassword !== newPassword
                          ? "border-red-300 bg-red-50"
                          : confirmPassword && confirmPassword === newPassword
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword && confirmPassword === newPassword && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Passwords match
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Password Requirements
                  </h4>
                  <ul className="space-y-2">
                    {passwordRequirements.map((req) => {
                      const isMet = req.check(newPassword);
                      return (
                        <li
                          key={req.id}
                          className={`flex items-center gap-2 text-sm ${
                            isMet ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {isMet ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          )}
                          {req.text}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || status.type === "success"}
                  className="w-full bg-linear-to-r from-orange-600 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Changing Password...
                    </>
                  ) : status.type === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Password Changed!
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Change Password
                    </>
                  )}
                </button>
              </form>

              {/* Security Tips */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">
                  🔐 Security Tips
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Never share your password with anyone</li>
                  <li>• Use a unique password for each account</li>
                  <li>• Consider using a password manager</li>
                  <li>• Change your password regularly</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
