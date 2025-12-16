import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

export default function StepOTP() {
  const navigate = useNavigate();

  // Get email strictly — no fake fallback
  const email = localStorage.getItem("pendingEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false); // For error animation

  const inputsRef = useRef([]);

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }
    inputsRef.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // clear error on typing
    if (error) setError(""); 

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

    const newOtp = pasted.split("");
    while (newOtp.length < 6) newOtp.push("");

    setOtp(newOtp);
    setError("");
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const verifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid OTP");
      }

      localStorage.removeItem("pendingEmail");
      navigate("/");
    } catch (err) {
      setError(err.message);
      triggerShake();
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setError("");
    try {
      const res = await fetch("/api/register/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Resend failed");
      }
      
      // Ideally, show a success toast here instead of setting error text
      alert("A new code has been sent to your email."); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl ring-1 ring-gray-900/5 px-8 py-12">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-blue-100">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Verification Code
            </h2>
            <p className="text-gray-500 text-center text-sm px-4">
              Enter the 6-digit code sent to <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>

          {/* OTP Input Section */}
          <motion.div
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex justify-center gap-2 sm:gap-3 mb-8"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={digit}
                type="text"
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-3xl font-mono font-medium rounded-xl border transition-all duration-200 outline-none select-none
                  ${
                    error
                      ? "border-red-300 bg-red-50 text-red-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 caret-blue-600"
                  } shadow-sm`}
              />
            ))}
          </motion.div>

          {/* Error Message with Animation */}
          <div className="h-6 mb-6 flex justify-center">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-red-500 text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={verifyOTP}
              disabled={isLoading || otp.join("").length !== 6}
              className={`w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg shadow-blue-500/20 transition-all duration-200
                flex justify-center items-center gap-2
                ${
                  isLoading || otp.join("").length !== 6
                    ? "bg-gray-300 cursor-not-allowed shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Verify Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Didn’t receive the code?{" "}
                <button
                  onClick={resendOTP}
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                >
                  Click to resend
                </button>
              </p>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}