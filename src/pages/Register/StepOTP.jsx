import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, reSend } from "../../http/verify-otp";

// Import modular components
import OTPNavbar from "./components/OTPNavbar";
import OTPCard from "./components/OTPCard";

/* ---------- STRICT ERROR FILTER ---------- */
const getUserErrorMessage = (error) => {
  const allowedMessages = [
    "Invalid OTP",
    "OTP expired",
    "Too many attempts",
    "OTP already used",
    "Email not found"
  ];

  const backendMessage = error?.response?.data?.message;

  if (allowedMessages.includes(backendMessage)) {
    return backendMessage;
  }

  return "Verification failed. Please try again.";
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
      const res = await verifyOtp(email, otpString);
      const data = res.data;

      // After successful OTP verification, redirect to login page
      localStorage.removeItem("pendingEmail");
      navigate("/login");

    } catch (err) {
      setError(getUserErrorMessage(err));
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
      const res = await reSend(email);
      const data = res.data;

      if (!data || !data.message) {
        throw { response: { data } };
      }

      // Clear OTP inputs on resend
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(getUserErrorMessage(err));
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
