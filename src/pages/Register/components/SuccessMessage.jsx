export default function SuccessMessage() {
  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
      <div className="flex items-center gap-4">
        <span className="material-icons-round text-green-600 text-4xl flex-shrink-0">
          check_circle
        </span>
        <div>
          <p className="text-green-900 font-bold text-xl">Registration Successful!</p>
          <p className="text-green-700 mt-1">Redirecting to OTP verification...</p>
        </div>
      </div>
    </div>
  );
}
