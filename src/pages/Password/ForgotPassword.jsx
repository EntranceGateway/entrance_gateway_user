import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  KeyRound,
  Shield,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
  { id: 5, text: "One special character", check: (p) => /[^a-zA-Z0-9]/.test(p) },
];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP Verify, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifiedOtp, setVerifiedOtp] = useState(""); // Store verified OTP for password reset
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef([]);
  const { newPassword, confirmPassword } = passwords;
  const passwordStrength = getPasswordStrength(newPassword);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  // Format countdown time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedValue = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedValue.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedValue.length, 5);
      otpRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
    // Clear error when typing
    if (status.type === "error") {
      setStatus({ type: null, message: "" });
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus({ type: "error", message: "Please enter your email address" });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: "error", message: "Please enter a valid email address" });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await api.post("/user/forgot-password", { email });

      if (response.status === 200) {
        setStep(2);
        setCountdown(120); // 2 minutes
        setCanResend(false);
        setStatus({
          type: "success",
          message: response.data?.message || "OTP sent to your email!",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP. Please try again.";

      if (error.response?.status === 404) {
        setStatus({ type: "error", message: "Email not registered" });
      } else if (error.response?.status === 400) {
        setStatus({ type: "error", message: "Account not verified. Please verify your email first." });
      } else if (error.response?.status === 429) {
        setStatus({ type: "error", message: "Too many requests. Please wait before trying again." });
      } else {
        setStatus({ type: "error", message: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await api.post("/user/forgot-password", { email });

      if (response.status === 200) {
        setOtp(["", "", "", "", "", ""]);
        setCountdown(120);
        setCanResend(false);
        setStatus({ type: "success", message: "New OTP sent to your email!" });
        otpRefs.current[0]?.focus();
      }
    } catch (error) {
      if (error.response?.status === 429) {
        setStatus({ type: "error", message: "Too many requests. Please wait before trying again." });
      } else {
        setStatus({
          type: "error",
          message: error.response?.data?.message || "Failed to resend OTP",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setStatus({ type: "error", message: "Please enter the complete 6-digit OTP" });
      return;
    }

    // Store the verified OTP and move to password step
    setVerifiedOtp(otpValue);
    setStep(3);
    setStatus({ type: "success", message: "OTP verified! Now create your new password." });
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setStatus({ type: "error", message: "Please enter a new password" });
      return;
    }

    if (newPassword.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters" });
      return;
    }

    const allRequirementsMet = passwordRequirements.every((req) =>
      req.check(newPassword)
    );
    if (!allRequirementsMet) {
      setStatus({ type: "error", message: "Password does not meet all requirements" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await api.post("/user/reset-password", {
        email,
        otp: verifiedOtp,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200) {
        setStep(4);
        setStatus({
          type: "success",
          message: response.data?.message || "Password reset successfully!",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password. Please try again.";

      if (error.response?.status === 400) {
        setStatus({ type: "error", message: "Invalid or expired OTP. Please go back and request a new code." });
      } else if (error.response?.status === 404) {
        setStatus({ type: "error", message: "User not found" });
      } else if (error.response?.status === 429) {
        setStatus({ type: "error", message: "Too many failed attempts. Please try again later." });
      } else {
        setStatus({ type: "error", message: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((stepNum, index) => (
        <React.Fragment key={stepNum}>
          <div
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              step >= stepNum
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step > stepNum ? (
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              stepNum
            )}
          </div>
          {index < 3 && (
            <div
              className={`w-8 md:w-12 h-1 mx-1 md:mx-2 rounded transition-all ${
                step > stepNum ? "bg-orange-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Decorative */}
      <div className="md:w-1/2 bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center p-10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 border-4 border-white rounded-full"></div>
        </div>

        <div className="text-center text-white relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl inline-block mb-6"
          >
            <KeyRound className="w-16 h-16" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4"
          >
            Forgot Password?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg max-w-sm"
          >
            Don't worry! It happens to the best of us. Enter your email and we'll send you a reset code.
          </motion.p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-10 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8"
        >
          {/* Back Link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {/* Step Indicator */}
          <StepIndicator />

          {/* Status Message */}
          <AnimatePresence mode="wait">
            {status.type && step !== 3 && step !== 4 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
                <p
                  className={`text-sm ${
                    status.type === "success" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {status.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Email Input */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Reset Your Password
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter your email address and we'll send you a verification code.
                </p>

                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status.type === "error") {
                            setStatus({ type: null, message: "" });
                          }
                        }}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-r from-orange-600 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Verification Code
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP Verification Only */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Verify Your Email
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter the 6-digit code sent to <span className="font-medium text-gray-800">{email}</span>
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Verification Code
                    </label>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                        />
                      ))}
                    </div>

                    {/* Timer & Resend */}
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        {countdown > 0 ? (
                          <span>Code expires in {formatTime(countdown)}</span>
                        ) : (
                          <span className="text-red-500">Code expired</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={!canResend || isSubmitting}
                        className={`flex items-center gap-1 ${
                          canResend
                            ? "text-orange-600 hover:text-orange-700"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Resend Code
                      </button>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 text-sm">Security Check</h4>
                        <p className="text-blue-700 text-xs mt-1">
                          We sent a verification code to your email. Enter it above to confirm your identity.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp(["", "", "", "", "", ""]);
                        setStatus({ type: null, message: "" });
                      }}
                      className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || otp.join("").length !== 6}
                      className="flex-1 bg-linear-to-r from-orange-600 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify Code
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Create New Password */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Create New Password
                    </h2>
                    <p className="text-green-600 text-sm">Email verified successfully!</p>
                  </div>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setPasswords((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }));
                          if (status.type === "error") {
                            setStatus({ type: null, message: "" });
                          }
                        }}
                        placeholder="Enter new password"
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

                    {/* Password Strength */}
                    {newPassword && (
                      <div className="mt-3">
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
                            className={`h-full rounded-full ${
                              passwordStrength.color === "red"
                                ? "bg-red-500"
                                : passwordStrength.color === "yellow"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          />
                        </div>
                      </div>
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
                        value={confirmPassword}
                        onChange={(e) => {
                          setPasswords((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }));
                          if (status.type === "error") {
                            setStatus({ type: null, message: "" });
                          }
                        }}
                        placeholder="Confirm new password"
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
                      <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                    )}
                    {confirmPassword && confirmPassword === newPassword && (
                      <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Passwords match
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
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-r from-orange-600 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Reset Password
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Password Reset Successful!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your password has been reset successfully. You can now login with your new password.
                </p>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-linear-to-r from-orange-600 to-amber-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <p className="mt-8 text-center text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Entrance Gateway. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
