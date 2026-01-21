import { useState } from "react";
import { X } from "lucide-react";

export default function FloatingNotification({ title, message, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce cursor-pointer hover:scale-105 transition-transform" style={{ animationDuration: "4s" }}>
      <div className="bg-accent text-white p-5 rounded-2xl shadow-2xl max-w-sm border border-white/10 flex items-start gap-4 backdrop-blur-md">
        <div className="bg-primary p-2.5 rounded-xl text-accent shadow-lg shadow-primary/30">
          <span className="material-icons-round text-xl">campaign</span>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-1">{title || "New Update!"}</h4>
          <p className="text-xs text-blue-200 leading-snug">{message || "Click to view more details."}</p>
        </div>
        <button onClick={handleClose} className="text-white/40 hover:text-white transition-colors -mt-1 -mr-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}