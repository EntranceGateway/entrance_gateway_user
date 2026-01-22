export default function SelectInput({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  required,
  options = [],
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`
            block w-full px-4 py-3 rounded-lg border shadow-sm 
            text-gray-900 bg-white
            focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm
            transition-colors
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
            }
            ${disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : ""}
          `}
        >
          {options.map((option, index) => (
            <option
              key={index}
              value={option.value}
              disabled={option.value === ""}
            >
              {option.label}
            </option>
          ))}
        </select>
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
