import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Input = ({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  onChange,
  errors,
  placeholder,
  disabled,
  required = true,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const errorMessage = errors?.message;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative group">
        {Icon && (
          <div
            className={`
              absolute left-4 top-1/2 -translate-y-1/2
              ${errorMessage ? "text-red-500" : isFocused ? "text-blue-600" : "text-slate-400"}
            `}
          >
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
            onBlur && onBlur(e);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full ${Icon ? "pl-12" : "pl-4"} pr-12 py-3.5 rounded-xl
            border-2 bg-white font-medium
            ${
              errorMessage
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            }
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;
