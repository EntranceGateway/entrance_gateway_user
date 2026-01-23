import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

/**
 * Toast Notification Component
 */
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
      <div className="bg-amber-500 text-white px-6 py-4 rounded-lg shadow-2xl max-w-md flex items-center gap-3">
        <span className="material-symbols-outlined text-2xl flex-shrink-0">
          lock
        </span>
        <div className="flex-1">
          <p className="font-semibold text-sm">{message}</p>
          <p className="text-xs mt-1 opacity-90">Redirecting to login...</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors font-bold text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Shows toast and redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children }) {
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      // Show toast first
      setShowToast(true);
      
      // Delay redirect to allow toast to be visible
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [accessToken]);

  // If authenticated, render children
  if (accessToken) {
    return children;
  }

  // If should redirect, navigate to login
  if (shouldRedirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show toast while waiting to redirect
  return (
    <>
      {showToast && (
        <Toast
          message="Please login to access this content"
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    </>
  );
}
