import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, reSend } from "../../http/verify-otp";

// Import modular components
import OTPNavbar from "./components/OTPNavbar";
import OTPCard from "./components/OTPCard";

/**
 * Parse error response from OTP verification API
 * Handles different error formats: validation errors, simple messages, etc.
 */
const parseOtpError = (error) => {
  const response = error.response?.data;
  
  if (!response) {
    return {
      message: "Verification failed. Please try again.",
      fieldError: null,
    };
  }

  // Handle validation errors (400 with errors object)
  // Example: { message: "Validation failed", errors: { otp: "OTP must be 6 characters long" } }
  if (response.errors && typeof response.errors === 'object') {
    const otpError = response.errors.otp;
    return {
      message: otpError || response.message || "Invalid OTP format",
      fieldError: otpError,
    };
  }

  // Handle specific error messages
  // 400: "Invalid or expired OTP"
  // 404: "User not found with email: ..."
  const message = response.message || "Verification failed. Please try again.";
  
  return {
    message,
    fieldError: null,
  };
};

export default function StepOTP() {
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [resendTimer, setResendTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(180); // 3 minutes = 180 seconds
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  const inputsRef = useRef([]);

  /* ---------- GUARD ---------- */
  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }
    inputsRef.current[0]?.focus();
  }, [email, navigate]);

  /* ---------- RESEND TIMER ---------- */
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  /* ---------- OTP EXPIRY TIMER (3 minutes) ---------- */
  useEffect(() => {
    if (otpExpiryTimer > 0 && !isOtpExpired) {
      const timer = setTimeout(() => setOtpExpiryTimer(otpExpiryTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (otpExpiryTimer === 0 && !isOtpExpired) {
      setIsOtpExpired(true);
      setError("OTP has expired. Please request a new code.");
    }
  }, [otpExpiryTimer, isOtpExpired]);

  /* ---------- HELPERS ---------- */
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const filled = pasted.split("");
    while (filled.length < 6) filled.push("");

    setOtp(filled);
    setError("");
    inputsRef.current[pasted.length - 1]?.focus();
  };

  /* ---------- VERIFY OTP ---------- */
  const verifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Enter the complete 6-digit code.");
      triggerShake();
      return;
    }

    if (isOtpExpired) {
      setError("OTP has expired. Please request a new code.");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await verifyOtp(email, otpString);

      // After successful OTP verification, redirect to login page
      localStorage.removeItem("pendingEmail");
      navigate("/login");

    } catch (err) {
      const errorData = parseOtpError(err);
      setError(errorData.message);
      triggerShake();
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- RESEND OTP ---------- */
  const resendOTP = async () => {
    if (!canResend) return;

    setError("");
    setCanResend(false);
    setResendTimer(59);
    setIsOtpExpired(false);
    setOtpExpiryTimer(180); // Reset to 3 minutes

    try {
      await reSend(email);

      // Clear OTP inputs on resend
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (err) {
      const errorData = parseOtpError(err);
      setError(errorData.message);
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  /* ---------- UI ---------- */
  return (
    <div className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col antialiased selection:bg-brand-gold selection:text-brand-navy">
      {/* Navbar */}
      <OTPNavbar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <OTPCard
            email={email}
            otp={otp}
            error={error}
            shake={shake}
            isLoading={isLoading}
            canResend={canResend}
            resendTimer={resendTimer}
            otpExpiryTimer={otpExpiryTimer}
            isOtpExpired={isOtpExpired}
            inputsRef={inputsRef}
            onOtpChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onVerify={verifyOTP}
            onResend={resendOTP}
            formatTimer={formatTimer}
            onBackToSignIn={() => navigate("/login")}
          />

          <p className="text-center text-xs text-gray-400">
            © 2024 EntranceGateway Education Pvt Ltd. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
