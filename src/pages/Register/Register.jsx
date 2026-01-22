import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import STATUSES from "../../status/statuses";
import { addAuth, setStatus, setError } from "../../../store/authSlice";

// Import modular components
import RegisterHero from "./components/RegisterHero";
import RegisterForm from "./components/RegisterForm";
import SuccessMessage from "./components/SuccessMessage";
import ErrorMessage from "./components/ErrorMessage";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error: backendError } = useSelector((state) => state.auth);

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

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const isLoading = status === STATUSES.LOADING;
  const showSuccess = status === STATUSES.SUCCESS;

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

  // Handle backend error
  useEffect(() => {
    if (backendError) {
      let fieldErrors = {};
      let genericMessage = null;

      if (typeof backendError === "object" && backendError !== null && !Array.isArray(backendError)) {
        Object.keys(backendError).forEach((key) => {
          if (["fullname", "email", "contact", "address", "dob", "interested", "latestQualification", "password"].includes(key)) {
            fieldErrors[key] = backendError[key];
          } else if (key === "error" || key === "message") {
            genericMessage = backendError[key];
          }
        });
      }

      if (typeof backendError === "string") {
        genericMessage = backendError;
      } else if (backendError.message) {
        genericMessage = backendError.message;
      } else if (backendError.error) {
        genericMessage = backendError.error;
      }

      if (genericMessage && !Object.keys(fieldErrors).length) {
        const lower = genericMessage.toLowerCase();
        if (lower.includes("email")) fieldErrors.email = genericMessage;
        else if (lower.includes("contact") || lower.includes("phone") || lower.includes("mobile")) fieldErrors.contact = genericMessage;
        else if (lower.includes("password")) fieldErrors.password = genericMessage;
        else genericMessage = genericMessage;
      }

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

    setGeneralError(null);
    dispatch(setError(null));

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const payload = { ...formData, role: "users" };
    await dispatch(addAuth(payload));
  };

  const clearGeneralError = () => {
    setGeneralError(null);
    dispatch(setError(null));
  };

  return (
    <div className="flex w-full h-screen bg-white overflow-hidden">
      {/* Left Side - Hero Section (Fixed) */}
      <RegisterHero />

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 lg:ml-auto flex flex-col h-screen">
        {/* Mobile Logo - Fixed */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-8 pb-4 flex-shrink-0">
          <span className="material-icons-round text-brand-blue text-3xl">school</span>
          <span className="font-bold text-xl text-brand-navy font-roboto">EntranceGateway</span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-md mx-auto py-12">
            {/* Header - Fixed at top of scroll */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-brand-navy font-roboto mb-2">
                Create Account
              </h1>
              <p className="text-gray-500 text-sm">
                Fill in your details to start your preparation.
              </p>
            </div>

            {/* Success Message */}
            {showSuccess && <SuccessMessage />}

            {/* Error Message */}
            {generalError && !showSuccess && (
              <ErrorMessage message={generalError} onClose={clearGeneralError} />
            )}

            {/* Registration Form - Scrollable */}
            <RegisterForm
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              showSuccess={showSuccess}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
            />

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-semibold text-brand-blue hover:text-brand-navy transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>

            {/* Support Link */}
            <div className="mt-12 border-t border-gray-100 pt-6 text-center pb-8">
              <p className="text-xs text-gray-400">
                Need help with registration?{" "}
                <a href="#" className="text-gray-500 hover:text-gray-700 underline">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
