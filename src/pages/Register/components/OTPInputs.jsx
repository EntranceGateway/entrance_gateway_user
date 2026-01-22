export default function OTPInputs({
  otp,
  error,
  shake,
  inputsRef,
  onChange,
  onKeyDown,
  onPaste,
}) {
  return (
    <div>
      {/* OTP Input Fields */}
      <div
        className={`flex justify-between gap-2 ${shake ? "animate-shake" : ""}`}
        onPaste={onPaste}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            value={digit}
            onChange={(e) => onChange(e.target.value, index)}
            onKeyDown={(e) => onKeyDown(e, index)}
            autoFocus={index === 0}
            maxLength={1}
            type="text"
            inputMode="numeric"
            placeholder="-"
            className={`
              w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-brand-navy 
              border-2 rounded-lg shadow-sm 
              focus:ring-0 focus:outline-none transition-colors 
              placeholder-transparent
              ${
                error
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:bg-white"
              }
            `}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-center text-xs text-semantic-error flex items-center justify-center gap-1">
          <span className="material-icons-round text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  );
}
