import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { fetchNoteDetails } from "../../../http/notes";
import { AlertTriangle } from "lucide-react";

// Import modular components
import {
  NoteInfoSidebar,
  NotePdfViewer,
  NoteDescription,
} from "./components";

/**
 * Security Warning Toast Component
 */
const SecurityWarning = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 z-[2000] bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in max-w-md">
    <AlertTriangle size={24} className="flex-shrink-0" />
    <div className="flex-1">
      <p className="font-semibold text-sm">{message}</p>
      <p className="text-xs mt-1 opacity-90">This action has been logged.</p>
    </div>
    <button 
      onClick={onClose}
      className="text-white hover:text-gray-200 font-bold text-xl leading-none"
    >
      ×
    </button>
  </div>
);

export default function NoteDetailPage() {
  const { id } = useParams();
  
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [securityWarning, setSecurityWarning] = useState(null);
  const pageRef = useRef(null);
  const devToolsCheckInterval = useRef(null);

  // Fetch note details
  useEffect(() => {
    const loadNoteDetails = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchNoteDetails(id);
        setNote(response.data);
      } catch (err) {
        console.error("Failed to fetch note details:", err);
        setError(err.message || "Failed to load note details");
      } finally {
        setLoading(false);
      }
    };

    loadNoteDetails();
  }, [id]);

  // Comprehensive Security Protection for Entire Page
  useEffect(() => {
    if (!pageRef.current || loading) return;

    const pageElement = pageRef.current;
    
    // Show security warning helper
    const showWarning = (message) => {
      setSecurityWarning(message);
      console.warn(`[SECURITY] ${message} - Timestamp: ${new Date().toISOString()}`);
      setTimeout(() => setSecurityWarning(null), 5000);
    };

    // 1. Prevent right-click/context menu on entire page
    const preventContextMenu = (e) => {
      e.preventDefault();
      showWarning("Right-click is disabled for security purposes");
    };
    pageElement.addEventListener('contextmenu', preventContextMenu);
    
    // 2. Disable print/save keyboard shortcuts + screenshot detection
    const preventHotkeys = (e) => {
      // Ctrl+P / Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        showWarning("Printing is disabled for this document");
        return;
      }
      
      // Ctrl+S / Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showWarning("Saving is disabled for this document");
        return;
      }

      // Screenshot detection (Windows: PrtScn, Win+Shift+S)
      if (e.key === 'PrintScreen' || 
          (e.metaKey && e.shiftKey && e.key === 's') ||
          (e.key === 'Meta' && e.shiftKey)) {
        showWarning("Screenshot detected - This action is being monitored");
      }

      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (DevTools shortcuts)
      if (e.key === 'F12' || 
          ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          ((e.ctrlKey || e.metaKey) && e.key === 'u')) {
        e.preventDefault();
        showWarning("Developer tools access is restricted");
      }
    };
    window.addEventListener('keydown', preventHotkeys);
    window.addEventListener('keyup', preventHotkeys);

    // 3. Copy/Paste blocking
    const preventCopy = (e) => {
      e.preventDefault();
      showWarning("Copying content is not allowed");
    };
    const preventCut = (e) => {
      e.preventDefault();
      showWarning("Cutting content is not allowed");
    };
    pageElement.addEventListener('copy', preventCopy);
    pageElement.addEventListener('cut', preventCut);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCut);

    // 4. Drag prevention
    const preventDrag = (e) => {
      e.preventDefault();
      showWarning("Dragging content is not allowed");
    };
    const preventDragStart = (e) => {
      e.preventDefault();
      return false;
    };
    pageElement.addEventListener('drag', preventDrag);
    pageElement.addEventListener('dragstart', preventDragStart);
    pageElement.addEventListener('dragend', preventDrag);
    pageElement.addEventListener('drop', preventDrag);

    // 5. Selection prevention
    const preventSelection = (e) => {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    };
    pageElement.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });
    pageElement.addEventListener('mousedown', preventSelection);

    // 6. DevTools detection
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        showWarning("Developer tools detected - Document access is being monitored");
      }
    };
    
    detectDevTools();
    devToolsCheckInterval.current = setInterval(detectDevTools, 1000);

    // 7. Visibility change detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.warn("[SECURITY] User switched away from document - Potential screenshot attempt");
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 8. Apply CSS security styles
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'note-page-security-style';
    style.innerHTML = `
      @media print {
        body * {
          display: none !important;
        }
        body::before {
          content: "Printing is not allowed for this document";
          display: block !important;
          text-align: center;
          padding: 50px;
          font-size: 24px;
          color: red;
        }
      }
      .note-detail-page {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        -webkit-touch-callout: none !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      pageElement.removeEventListener('contextmenu', preventContextMenu);
      window.removeEventListener('keydown', preventHotkeys);
      window.removeEventListener('keyup', preventHotkeys);
      pageElement.removeEventListener('copy', preventCopy);
      pageElement.removeEventListener('cut', preventCut);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCut);
      pageElement.removeEventListener('drag', preventDrag);
      pageElement.removeEventListener('dragstart', preventDragStart);
      pageElement.removeEventListener('dragend', preventDrag);
      pageElement.removeEventListener('drop', preventDrag);
      pageElement.removeEventListener('selectstart', preventSelection);
      pageElement.removeEventListener('mousedown', preventSelection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (devToolsCheckInterval.current) {
        clearInterval(devToolsCheckInterval.current);
      }
      
      const existingStyle = document.getElementById('note-page-security-style');
      if(existingStyle) document.head.removeChild(existingStyle);
    };
  }, [loading]);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading note details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !note) {
    return (
      <DashboardLayout>
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              error
            </span>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              Failed to Load Note
            </h2>
            <p className="text-gray-500">{error || "Note not found"}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Security Warning Toast */}
      {securityWarning && (
        <SecurityWarning 
          message={securityWarning} 
          onClose={() => setSecurityWarning(null)} 
        />
      )}
      
      <div ref={pageRef} className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col transition-colors duration-200 antialiased note-detail-page">
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar - Left (4 columns) */}
              <div className="lg:col-span-4 space-y-6">
                <NoteInfoSidebar note={note} />
              </div>

              {/* Main Content - Right (8 columns) */}
              <div className="lg:col-span-8">
                {/* PDF Viewer */}
                <NotePdfViewer
                  fileName={note.noteName}
                />

                {/* Description */}
                <NoteDescription description={note.noteDescription} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
