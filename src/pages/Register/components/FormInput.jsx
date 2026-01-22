export default function FormInput({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  disabled,
  required,
  icon,
}) {
  const hasError = !!error;
  const isValid = value && !hasError;

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <span className="material-icons-round text-[20px]">{icon}</span>
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            block w-full ${icon ? "pl-10" : "pl-4"} ${isValid ? "pr-10" : "pr-4"} py-3 rounded-lg 
            border shadow-sm text-gray-900 placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm
            transition-colors
            ${
              hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : isValid
                ? "border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50/30"
                : "border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
            }
            ${disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : "bg-white"}
          `}
        />
        {isValid && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-green-500">
            <span className="material-icons-round text-[20px]">check</span>
          </span>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-start gap-1 mt-1">
          <span className="material-icons-round text-[16px] mt-0.5">error</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
