import { useState } from "react";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";
import SelectInput from "./SelectInput";

export default function RegisterForm({
  formData,
  errors,
  isLoading,
  showSuccess,
  onChange,
  onBlur,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Full Name */}
      <FormInput
        label="Full Name"
        id="fullname"
        name="fullname"
        type="text"
        value={formData.fullname}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.fullname}
        placeholder="e.g. Aarav Sharma"
        disabled={isLoading || showSuccess}
        required
      />

      {/* Email */}
      <FormInput
        label="Email Address"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.email}
        placeholder="name@example.com"
        disabled={isLoading || showSuccess}
        icon="mail"
        required
      />

      {/* Phone Number */}
      <FormInput
        label="Phone Number"
        id="contact"
        name="contact"
        type="tel"
        value={formData.contact}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.contact}
        placeholder="9800000000"
        disabled={isLoading || showSuccess}
        required
      />

      {/* Address */}
      <FormInput
        label="Address"
        id="address"
        name="address"
        type="text"
        value={formData.address}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.address}
        placeholder="City, Country"
        disabled={isLoading || showSuccess}
        required
      />

      {/* Date of Birth */}
      <FormInput
        label="Date of Birth"
        id="dob"
        name="dob"
        type="date"
        value={formData.dob}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.dob}
        disabled={isLoading || showSuccess}
        required
      />

      {/* Desired Course */}
      <SelectInput
        label="Desired Course"
        id="interested"
        name="interested"
        value={formData.interested}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.interested}
        disabled={isLoading || showSuccess}
        options={[
          { value: "", label: "Select your preparation path" },
          { value: "ioe", label: "BE Entrance (IOE)" },
          { value: "iom", label: "MBBS/BDS Entrance (IOM/CEE)" },
          { value: "cmat", label: "BBA/BIM (CMAT)" },
          { value: "ku", label: "KUUMAT (Kathmandu University)" },
          { value: "neb", label: "Class 11 & 12 Science Support" },
        ]}
        required
      />

      {/* Latest Qualification */}
      <FormInput
        label="Latest Qualification"
        id="latestQualification"
        name="latestQualification"
        type="text"
        value={formData.latestQualification}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.latestQualification}
        placeholder="e.g. +2 Science, Bachelor's"
        disabled={isLoading || showSuccess}
        required
      />

      {/* Password */}
      <PasswordInput
        label="Password"
        id="password"
        name="password"
        value={formData.password}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.password}
        disabled={isLoading || showSuccess}
        required
      />

      {/* Terms and Conditions */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded cursor-pointer"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-700">
            I agree to the{" "}
            <a
              href="#"
              className="text-brand-blue hover:text-brand-navy underline decoration-1 underline-offset-2"
            >
              Terms and Conditions
            </a>{" "}
            and Privacy Policy.
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading || showSuccess}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-brand-navy bg-brand-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-colors transform active:scale-[0.99] duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : showSuccess ? (
            <div className="flex items-center gap-2">
              <span className="material-icons-round text-xl">check_circle</span>
              <span>Account Created!</span>
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </div>
    </form>
  );
}
