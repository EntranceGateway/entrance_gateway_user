export default function LoginFormInput({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  icon,
  required = false,
  autoComplete 
}) {
  return (
    <div>
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-gray-400 text-xl">
            {icon}
          </span>
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue sm:text-sm transition-all"
        />
      </div>
    </div>
  );
}
