import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { verifyOtp, reSend } from "../../http/verify-otp";

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

  const inputsRef = useRef([]);

  /* ---------- GUARD ---------- */
  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }
    inputsRef.current[0]?.focus();
  }, [email, navigate]);

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

    setIsLoading(true);
    setError("");

    try {
      const res = await verifyOtp(email, otpString);
      const data = res.data;

      // ✅ BACKEND MATCH (this is the key fix)
      if (!data || !data.data) {
        throw { response: { data } };
      }

      localStorage.removeItem("pendingEmail");
      navigate("/");
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
    setError("");

    try {
      const res = await reSend(email);
      const data = res.data;

      if (!data || !data.message) {
        throw { response: { data } };
      }

      alert("A new OTP has been sent to your email.");
    } catch (err) {
      setError(getUserErrorMessage(err));
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 bg-blue-50 flex items-center justify-center rounded-xl">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">Verification Code</h2>
          <p className="text-sm text-gray-500 mt-2">{email}</p>
        </div>

        <motion.div
          animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
          className="flex justify-center gap-2 mb-6"
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              maxLength={1}
              inputMode="numeric"
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`w-12 h-14 text-center text-2xl rounded-lg border
                ${
                  error
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 focus:border-blue-500"
                }`}
            />
          ))}
        </motion.div>

        <div className="h-6 mb-4 flex justify-center">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={verifyOTP}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:bg-gray-400"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              Verify <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Didn’t receive the code?{" "}
          <button
            onClick={resendOTP}
            className="text-blue-600 font-semibold"
          >
            Resend
          </button>
        </p>
      </motion.div>
    </div>
  );
}
