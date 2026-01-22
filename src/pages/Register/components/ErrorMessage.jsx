export default function ErrorMessage({ message, onClose }) {
  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl">
      <div className="flex items-start gap-4">
        <span className="material-icons-round text-red-600 text-3xl flex-shrink-0 mt-0.5">
          error
        </span>
        <div className="flex-1">
          <p className="text-red-900 font-bold text-lg mb-1">Registration Failed</p>
          <p className="text-red-700 text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <span className="material-icons-round text-xl">close</span>
        </button>
      </div>
    </div>
  );
}
