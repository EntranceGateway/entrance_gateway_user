import { useState } from "react";

export default function PasswordInput({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  required,
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!value) return { level: 0, bars: 0 };
    
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/\d/.test(value)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) strength++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
    
    return {
      level: strength,
      bars: Math.min(strength, 4),
    };
  };

  const strength = getPasswordStrength();
  const hasMinLength = value && value.length >= 8;
  const hasNumber = value && /\d/.test(value);
  const hasSpecialChar = value && /[!@#$%^&*(),.?":{}|<>]/.test(value);

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="••••••••"
          disabled={disabled}
          required={required}
          className={`
            block w-full pl-4 pr-12 py-3 rounded-lg border shadow-sm 
            text-gray-900 placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm
            transition-colors
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
            }
            ${disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : "bg-white"}
          `}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          tabIndex={-1}
        >
          <span className="material-icons-round text-[20px]">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>

      {/* Password Strength Indicator */}
      {value && (
        <div className="pt-2">
          <div className="flex gap-1 h-1 mb-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-colors ${
                  i < strength.bars
                    ? strength.level <= 1
                      ? "bg-red-500"
                      : strength.level === 2
                      ? "bg-yellow-500"
                      : "bg-green-500"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <ul className="text-xs text-gray-500 space-y-1 pl-1">
            <li
              className={`flex items-center gap-1.5 ${
                hasMinLength ? "text-green-600" : ""
              }`}
            >
              <span className="material-icons-round text-[10px]">
                {hasMinLength ? "check_circle" : "circle"}
              </span>
              <span>At least 8 characters</span>
            </li>
            <li
              className={`flex items-center gap-1.5 ${
                hasNumber ? "text-green-600" : ""
              }`}
            >
              <span className="material-icons-round text-[10px]">
                {hasNumber ? "check_circle" : "circle"}
              </span>
              <span>Contains a number</span>
            </li>
            <li
              className={`flex items-center gap-1.5 ${
                hasSpecialChar ? "text-green-600" : ""
              }`}
            >
              <span className="material-icons-round text-[10px]">
                {hasSpecialChar ? "check_circle" : "circle"}
              </span>
              <span>Contains a special symbol</span>
            </li>
          </ul>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-start gap-1 mt-1">
          <span className="material-icons-round text-[16px] mt-0.5">error</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
