export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined">error</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="material-symbols-outlined text-sm opacity-50 hover:opacity-100 transition-opacity"
      >
        close
      </button>
    </div>
  );
}
