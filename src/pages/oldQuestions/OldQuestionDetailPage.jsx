import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOldQuestionById } from "../../http/oldQuestions";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Import modular components
import {
  OldQuestionInfoSidebar,
  OldQuestionPdfViewer,
  OldQuestionDescription,
} from "./components/detail";

/**
 * Security Warning Toast Component
 */
const SecurityWarning = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 z-[2000] bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in max-w-md">
    <span className="material-symbols-outlined flex-shrink-0">warning</span>
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

export default function OldQuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);

  // Get question data from navigation state
  const questionFromState = location.state?.question;

  const [question, setQuestion] = useState(questionFromState || null);
  const [loading, setLoading] = useState(!questionFromState);
  const [error, setError] = useState(null);
  const [securityWarning, setSecurityWarning] = useState(null);
  const pageRef = useRef(null);
  const devToolsCheckInterval = useRef(null);

  // Fetch question details if not available from state
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      if (questionFromState) {
        setQuestion(questionFromState);
        setLoading(false);
        return;
      }

      if (!id || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getOldQuestionById(id, accessToken);
        setQuestion(data);
      } catch (err) {
        console.error("Failed to fetch question:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [id, accessToken, questionFromState]);

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
    style.id = 'old-question-page-security-style';
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
      .old-question-detail-page {
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
      
      const existingStyle = document.getElementById('old-question-page-security-style');
      if(existingStyle) document.head.removeChild(existingStyle);
    };
  }, [loading]);

  // Loading State
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
          <div className="inline-block w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading question paper...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Error or Not Found State
  if (error || !question) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-gray-400">
                description
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Question Not Found
            </h2>
            <p className="text-gray-500 mb-8">
              {error ||
                "The question paper you're looking for doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => navigate("/old-questions")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold hover:bg-yellow-500 text-brand-navy font-semibold rounded-lg transition-all shadow-sm"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Old Questions
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Auth Required State
  if (!accessToken) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-amber-600">
                lock
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Login Required
            </h2>
            <p className="text-gray-500 mb-8">
              Please log in to view this question paper.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold hover:bg-yellow-500 text-brand-navy font-semibold rounded-lg transition-all shadow-sm"
            >
              Login to Continue
            </button>
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
      
      <div ref={pageRef} className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col transition-colors duration-200 antialiased old-question-detail-page">
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-6">
                <OldQuestionInfoSidebar question={question} />
              </aside>

              {/* Main Content */}
              <section className="lg:col-span-8 space-y-6">
                {/* PDF Viewer */}
                <OldQuestionPdfViewer pdfFilePath={question.pdfFilePath} />

                {/* Description */}
                <OldQuestionDescription description={question.description} />
              </section>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
