import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, GraduationCap, Heart, Lock, Mail, MapPin, Phone,
  User, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Eye, EyeOff, XCircle
} from "lucide-react";

import STATUSES from "../../status/statuses";
import { addAuth, setStatus, setError } from "../../../store/authSlice";

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
];

// Enhanced Input Component (unchanged except for error prop usage)
const EnhancedInput = ({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  onChange,
  error,
  placeholder,
  disabled,
  required = true,
  onBlur
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className={`
            absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
            ${error ? 'text-red-500' : isFocused ? 'text-blue-600' : 'text-slate-400'}
          `}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full ${Icon ? 'pl-12' : 'pl-4'} pr-12 py-3.5 rounded-xl text-slate-900 placeholder-slate-400
            border-2 transition-all duration-200 bg-white
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
              : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
            }
            ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'hover:border-slate-300'}
            focus:outline-none font-medium
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {error && !isPassword && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-start gap-1.5 mt-1">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="break-words">{error}</span>
        </p>
      )}
    </div>
  );
};

// Password Strength Meter (unchanged)
const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const percentage = (strength / 5) * 100;

  const getColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getLabel = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium">Password Strength</span>
        <span className={`font-semibold ${strength <= 2 ? 'text-red-600' : strength <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
          {getLabel()}
        </span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Main Register Component
export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error: backendError } = useSelector((state) => state.auth);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    address: "",
    dob: "",
    interested: "",
    latestQualification: "",
    password: "",
  });

  // Single source of truth for all errors (frontend + backend)
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const isLoading = status === STATUSES.LOADING;
  const showSuccess = status === STATUSES.SUCCESS;

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Redirect on success
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        dispatch(setStatus(STATUSES.IDLE));
        dispatch(setError(null));
        navigate("/verify-otp");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate, dispatch]);

  // Handle backend error → merge into `errors` state
  useEffect(() => {
    if (backendError) {
      let fieldErrors = {};
      let genericMessage = null;

      // Case 1: Field-specific errors like { "contact": "..." }
      if (typeof backendError === "object" && backendError !== null && !Array.isArray(backendError)) {
        // Direct field errors
        Object.keys(backendError).forEach((key) => {
          if (["fullname", "email", "contact", "address", "dob", "interested", "latestQualification", "password"].includes(key)) {
            fieldErrors[key] = backendError[key];
          } else if (key === "error" || key === "message") {
            genericMessage = backendError[key];
          }
        });
      }

      // Case 2: Generic error message like { "error": "User already exists..." }
      if (typeof backendError === "string") {
        genericMessage = backendError;
      } else if (backendError.message) {
        genericMessage = backendError.message;
      } else if (backendError.error) {
        genericMessage = backendError.error;
      }

      // Try to extract field from generic message (e.g., email already exists)
      if (genericMessage && !Object.keys(fieldErrors).length) {
        const lower = genericMessage.toLowerCase();
        if (lower.includes("email")) fieldErrors.email = genericMessage;
        else if (lower.includes("contact") || lower.includes("phone") || lower.includes("mobile")) fieldErrors.contact = genericMessage;
        else if (lower.includes("password")) fieldErrors.password = genericMessage;
        else genericMessage = genericMessage; // fallback to general
      }

      // Apply errors
      if (Object.keys(fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
      if (genericMessage && !Object.keys(fieldErrors).length) {
        setGeneralError(genericMessage);
      }
    } else {
      setGeneralError(null);
    }
  }, [backendError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
      dispatch(setError(null));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "fullname":
        return !value.trim() ? "Full name is required" : value.trim().length < 2 ? "Name must be at least 2 characters" : null;
      case "email":
        return !value.trim() ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : null;
      case "contact":
        return !value.trim() ? "Phone number is required" : !/^\d{10}$/.test(value.replace(/^\+?977|977/, '')) ? "Phone must be exactly 10 digits" : null;
      case "address":
        return !value.trim() ? "Address is required" : value.trim().length < 5 ? "Address must be at least 5 characters" : null;
      case "dob":
        if (!value) return "Date of birth is required";
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        return age < 13 ? "You must be at least 13 years old" : age > 120 ? "Invalid date" : null;
      case "interested":
        return !value.trim() ? "Interest is required" : null;
      case "latestQualification":
        return !value.trim() ? "Qualification is required" : null;
      case "password":
        return !value ? "Password is required" : value.length < 6 ? "Password must be at least 6 characters" : null;
      default:
        return null;
    }
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset general error
    setGeneralError(null);
    dispatch(setError(null));

    // Validate all fields
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear any previous errors before API call
    setErrors({});

    const payload = { ...formData, role: "users" };
    await dispatch(addAuth(payload));
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* LEFT SIDE - Fixed Hero (unchanged) */}
      <div className="hidden lg:flex lg:w-5/12 fixed inset-y-0 left-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 h-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wider uppercase mb-8 w-fit backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            New Registration
          </div>

          <h1 className="text-5xl xl:text-6xl font-black leading-tight mb-6">
            Transform your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              future
            </span>{" "}today.
          </h1>

          <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-md">
            Join thousands of learners achieving their goals with our comprehensive platform.
          </p>

          <div className="relative mb-12">
            <div className="absolute -left-4 -top-2 text-6xl text-blue-500/20 font-serif">"</div>
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pl-4"
            >
              <p className="text-lg text-slate-300 font-light italic leading-relaxed mb-3">
                {QUOTES[currentQuoteIndex].text}
              </p>
              <p className="text-sm text-slate-500 font-semibold">
                — {QUOTES[currentQuoteIndex].author}
              </p>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-3">
            {["Free Access", "Expert Support", "24/7 Available"].map((feature, i) => (
              <div key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 inline mr-2 text-green-400" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-7/12 lg:ml-auto overflow-y-auto min-h-screen">
        <div className="py-12 px-6 sm:px-12 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3">
                Get Started
              </h2>
              <p className="text-lg text-slate-600">
                Create your account and unlock premium features.
              </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-green-900 font-bold text-xl">Registration Successful!</p>
                    <p className="text-green-700 mt-1">Redirecting to OTP verification...</p>
                  </div>
                </div>
              </div>
            )}

            {/* General Backend Error (when not field-specific) */}
            {generalError && !showSuccess && (
              <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl">
                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-900 font-bold text-lg mb-1">Registration Failed</p>
                    <p className="text-red-700 text-sm break-words">{generalError}</p>
                  </div>
                  <button
                    onClick={() => {
                      setGeneralError(null);
                      dispatch(setError(null));
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <EnhancedInput
                label="Full Name"
                name="fullname"
                icon={User}
                value={formData.fullname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.fullname}
                placeholder="John Doe"
                disabled={isLoading || showSuccess}
              />

              <EnhancedInput
                label="Email Address"
                name="email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                placeholder="john@company.com"
                disabled={isLoading || showSuccess}
              />

              <EnhancedInput
                label="Phone Number"
                name="contact"
                icon={Phone}
                value={formData.contact}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.contact}
                placeholder="9800000000"
                disabled={isLoading || showSuccess}
              />

              <EnhancedInput
                label="Address"
                name="address"
                icon={MapPin}
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.address}
                placeholder="City, Country"
                disabled={isLoading || showSuccess}
              />

              <EnhancedInput
                label="Date of Birth"
                name="dob"
                type="date"
                icon={Calendar}
                value={formData.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dob}
                disabled={isLoading || showSuccess}
              />

              <EnhancedInput
                label="Interested In"
                name="interested"
                icon={Heart}
                value={formData.interested}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.interested}
                placeholder="e.g. Technology, Design"
                disabled={isLoading || showSuccess}
              />

              <EnhancedInput
                label="Highest Qualification"
                name="latestQualification"
                icon={GraduationCap}
                value={formData.latestQualification}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.latestQualification}
                placeholder="Bachelor's in Computer Science"
                disabled={isLoading || showSuccess}
              />

              <div>
                <EnhancedInput
                  label="Password"
                  name="password"
                  type="password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  placeholder="Create a strong password"
                  disabled={isLoading || showSuccess}
                />
                <PasswordStrength password={formData.password} />
              </div>

              <button
                type="submit"
                disabled={isLoading || showSuccess}
                className="w-full py-4 px-6 mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Registered Successfully!
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-8">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </span>
            </p>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}