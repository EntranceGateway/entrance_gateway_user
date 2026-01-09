import React from "react";
import { FileText, Search, Inbox } from "lucide-react";

/**
 * Reusable EmptyState component
 * Displays when no content is available
 * 
 * @param {string} title - Main title text
 * @param {string} message - Description message
 * @param {string} variant - "default" | "notes" | "search"
 * @param {React.ReactNode} action - Optional action button/link
 */
export default function EmptyState({ 
  title = "No data found", 
  message,
  variant = "default",
  action
}) {
  const variants = {
    default: { icon: Inbox, color: "indigo" },
    notes: { icon: FileText, color: "indigo" },
    search: { icon: Search, color: "orange" },
  };

  const config = variants[variant] || variants.default;
  const Icon = config.icon;

  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-500",
    orange: "bg-orange-50 text-orange-500",
  };

  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colorClasses[config.color]}`}>
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-2 max-w-sm mx-auto">
        {message || "We couldn't find any data matching your criteria."}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
