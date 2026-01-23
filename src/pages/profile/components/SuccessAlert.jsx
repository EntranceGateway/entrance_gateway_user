export default function SuccessAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-semantic-success/10 border border-semantic-success/20 rounded-lg text-semantic-success mb-6">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined">check_circle</span>
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
