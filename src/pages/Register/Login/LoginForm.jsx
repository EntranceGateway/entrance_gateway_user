import { useState } from "react";
import { Link } from "react-router-dom";
import LoginFormInput from "./LoginFormInput";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginForm({ onSubmit, error }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        {/* Mobile Logo */}
        <div className="lg:hidden flex justify-center sm:justify-start items-center gap-2 mb-8">
          <span className="material-symbols-outlined text-brand-navy text-3xl">
            school
          </span>
          <span className="font-roboto font-bold text-xl text-brand-navy">
            EntranceGateway
          </span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-brand-navy font-roboto">
          Sign In
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Welcome back to your learning dashboard.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-red-500 text-xl">
            error
          </span>
          <p className="text-sm text-red-700 flex-1">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-5">
          {/* Email Input */}
          <LoginFormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            icon="mail"
            required
            autoComplete="email"
          />

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-brand-blue hover:text-brand-navy transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-xl">
                  lock
                </span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue sm:text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-brand-navy bg-brand-gold hover:bg-[#FFD54F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold shadow-sm hover:shadow transition-all duration-200 uppercase tracking-wide"
          >
            Sign In
          </button>
        </div>
      </form>

      {/* Social Login */}
      <SocialLoginButtons />

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600 pt-4">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-bold text-brand-blue hover:text-brand-navy hover:underline transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
