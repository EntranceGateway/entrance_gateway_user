import OTPInputs from "./OTPInputs";

export default function OTPCard({
  email,
  otp,
  error,
  shake,
  isLoading,
  canResend,
  resendTimer,
  otpExpiryTimer,
  isOtpExpired,
  inputsRef,
  onOtpChange,
  onKeyDown,
  onPaste,
  onVerify,
  onResend,
  formatTimer,
  onBackToSignIn,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
      {/* Top Gradient Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-brand-navy via-brand-blue to-brand-navy"></div>

      {/* Card Content */}
      <div className="p-8 sm:p-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="material-icons-round text-3xl text-brand-blue">
              lock_person
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-navy tracking-tight font-roboto mb-2">
            Verify Your Account
          </h2>
          <p className="text-sm text-gray-500">
            We've sent a 6-digit code to your email <br />
            <span className="font-medium text-gray-700">{email}</span>
          </p>
          
          {/* OTP Expiry Timer */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-100">
            <span className="material-icons-round text-lg text-brand-blue">
              schedule
            </span>
            <span className={`text-sm font-medium font-mono ${
              otpExpiryTimer <= 60 ? 'text-red-600' : 'text-brand-blue'
            }`}>
              {isOtpExpired ? 'Expired' : `Expires in ${formatTimer(otpExpiryTimer)}`}
            </span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onVerify();
          }}
          className="space-y-8"
        >
          {/* OTP Inputs */}
          <OTPInputs
            otp={otp}
            error={error}
            shake={shake}
            inputsRef={inputsRef}
            onChange={onOtpChange}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
          />

          {/* Actions */}
          <div className="space-y-4">
            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || isOtpExpired}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-brand-navy bg-brand-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-colors duration-200 uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : isOtpExpired ? (
                "OTP Expired"
              ) : (
                "Verify Account"
              )}
            </button>

            {/* Resend Section */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {isOtpExpired ? "OTP has expired. " : "Didn't receive the code? "}
                <button
                  type="button"
                  onClick={onResend}
                  disabled={!canResend}
                  className="font-medium text-brand-blue hover:text-brand-navy transition-colors ml-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isOtpExpired ? "Request New Code" : "Resend Code"}
                </button>
              </p>
              {!canResend && (
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  Resend in {formatTimer(resendTimer)}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-center">
        <button
          onClick={onBackToSignIn}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-brand-navy transition-colors"
        >
          <span className="material-icons-round text-lg mr-2">arrow_back</span>
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
