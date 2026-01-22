import React, { useEffect, useState, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// Importing professional icons from lucide-react
import { Loader2, Maximize, Minimize, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'; 

/**
 * PdfViewer Component with Comprehensive Security Features
 * 
 * SECURITY FEATURES IMPLEMENTED:
 * ================================
 * 
 * ✅ 1. RIGHT-CLICK PROTECTION
 *    - Disables context menu on PDF viewer
 *    - Prevents "Save Image As" and other context menu options
 * 
 * ✅ 2. PRINT BLOCKING
 *    - Blocks Ctrl+P / Cmd+P keyboard shortcuts
 *    - CSS @media print rules hide all content
 *    - Shows warning message if print is attempted
 * 
 * ✅ 3. SAVE BLOCKING
 *    - Blocks Ctrl+S / Cmd+S keyboard shortcuts
 *    - Prevents browser save dialog
 * 
 * ✅ 4. TEXT SELECTION PREVENTION
 *    - renderTextLayer={false} disables text layer
 *    - CSS user-select: none on all PDF elements
 *    - JavaScript selectstart event prevention
 *    - Automatic selection clearing on mousedown
 * 
 * ✅ 5. COPY/PASTE BLOCKING
 *    - Prevents copy events on viewer and document level
 *    - Prevents cut events
 *    - Shows security warning when attempted
 * 
 * ✅ 6. DRAG PREVENTION
 *    - Blocks drag, dragstart, dragend, and drop events
 *    - Prevents dragging PDF content to desktop/other apps
 * 
 * ✅ 7. SCREENSHOT DETECTION
 *    - Detects PrintScreen key press
 *    - Detects Windows Snipping Tool (Win+Shift+S)
 *    - Shows warning and logs the attempt
 *    - Note: Cannot fully prevent screenshots, but deters and monitors
 * 
 * ✅ 8. DEVTOOLS DETECTION
 *    - Monitors window size differences to detect open DevTools
 *    - Blocks F12, Ctrl+Shift+I, Ctrl+Shift+J shortcuts
 *    - Blocks Ctrl+U (view source)
 *    - Periodic checking every second
 *    - Shows warning when DevTools detected
 * 
 * ✅ 9. ANNOTATION LAYER DISABLED
 *    - renderAnnotationLayer={false} removes interactive elements
 *    - Prevents clicking on links or form fields in PDF
 * 
 * ✅ 10. VISIBILITY MONITORING
 *    - Tracks when user switches tabs/windows
 *    - Logs potential screenshot tool usage
 * 
 * ✅ 11. BLOB URL MANAGEMENT
 *    - Uses temporary blob URLs that are revoked on unmount
 *    - Prevents direct file access
 * 
 * LIMITATIONS:
 * ============
 * - Screenshots cannot be 100% prevented (OS-level functionality)
 * - Screen recording tools cannot be fully blocked
 * - Advanced users with DevTools can still inspect network requests
 * - Mobile devices have different screenshot mechanisms
 * 
 * RECOMMENDATIONS FOR ADDITIONAL SECURITY:
 * ========================================
 * - Implement server-side watermarking with user info
 * - Use time-limited signed URLs for PDF access
 * - Implement session tracking and access logging
 * - Add rate limiting on PDF endpoint
 * - Consider DRM solutions for highly sensitive documents
 */

// Configure the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Security Warning Toast Component
const SecurityWarning = ({ message, onClose }) => (
    <div className="fixed top-4 right-4 z-[10000] bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in max-w-md">
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

// Helper component for a styled button
const ViewerButton = ({ icon: Icon, onClick, title, disabled = false, isFullScreen = false, className = "" }) => (
    <button
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={`p-2 rounded-full transition-colors ${
            disabled 
                ? 'text-gray-400 cursor-not-allowed' 
                : isFullScreen
                    ? 'text-white hover:bg-gray-700 active:bg-gray-600'
                    : 'text-gray-600 hover:bg-gray-200 active:bg-gray-300'
        } ${className}`}
    >
        <Icon size={20} />
    </button>
);

const PdfViewer = ({ noteId, token, fetchPdfBlob, suburl, urlSuffix = "" }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageWidth, setPageWidth] = useState(800);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [securityWarning, setSecurityWarning] = useState(null);
    const [loadError, setLoadError] = useState(null);

    const viewerRef = useRef(null); 
    const pageWrapperRef = useRef(null);
    const devToolsCheckInterval = useRef(null);
    const currentPdfUrl = useRef(null);

    // --- 1. Load PDF Blob ---
    useEffect(() => {
        let isMounted = true;
        
        const loadPdf = async () => {
            if (!isMounted) return;
            
            setIsLoading(true);
            setLoadError(null);
            
            try {
                // Revoke previous object URL before fetching a new one
                if (currentPdfUrl.current) {
                    URL.revokeObjectURL(currentPdfUrl.current);
                    currentPdfUrl.current = null;
                }

                const blob = await fetchPdfBlob(`${suburl}/${noteId}${urlSuffix}`, token);
                
                if (!isMounted) return;
                
                const newPdfUrl = URL.createObjectURL(blob);
                currentPdfUrl.current = newPdfUrl;
                setPdfUrl(newPdfUrl);

            } catch (error) {
                console.error("Failed to load PDF:", error);
                if (isMounted) {
                    setPdfUrl(null);
                    setLoadError(error.message || "Failed to load PDF");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        
        loadPdf();

        // Cleanup: revoke the object URL when the component unmounts
        return () => {
            isMounted = false;
            if (currentPdfUrl.current) {
                URL.revokeObjectURL(currentPdfUrl.current);
                currentPdfUrl.current = null;
            }
        };
    }, [noteId, token, fetchPdfBlob, suburl, urlSuffix]);


    // --- 2. Handle Responsiveness and Page Width ---
    const calculatePageWidth = useCallback(() => {
        if (pageWrapperRef.current) {
            // Calculate width based on container size and fullscreen state
            const padding = isFullScreen ? 40 : 16; // Adjust padding for fullscreen vs windowed
            const containerWidth = pageWrapperRef.current.clientWidth;
            const width = Math.max(containerWidth - padding, 300); // Minimum width of 300px
            setPageWidth(width);
        }
    }, [isFullScreen]);

    useEffect(() => {
        calculatePageWidth();
        window.addEventListener("resize", calculatePageWidth);
        // Also recalculate on orientation change for mobile
        window.addEventListener("orientationchange", calculatePageWidth);
        return () => {
            window.removeEventListener("resize", calculatePageWidth);
            window.removeEventListener("orientationchange", calculatePageWidth);
        };
    }, [calculatePageWidth]); 


    // --- 3. Fullscreen Logic ---
    const handleFullScreen = () => {
        if (!viewerRef.current) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            // Request fullscreen on the main viewer container
            viewerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        }
    };

    // Listen to fullscreen changes to update component state
    useEffect(() => {
        const handleFullScreenChange = () => {
            const newIsFullScreen = !!document.fullscreenElement;
            setIsFullScreen(newIsFullScreen);
            // Recalculate width immediately after fullscreen change
            setTimeout(() => calculatePageWidth(), 100);
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
    }, [calculatePageWidth]);

    // --- 4. Comprehensive Security Measures ---
    useEffect(() => {
        if (!viewerRef.current) return;

        const viewerElement = viewerRef.current;
        
        // Show security warning helper
        const showWarning = (message) => {
            setSecurityWarning(message);
            console.warn(`[SECURITY] ${message} - Timestamp: ${new Date().toISOString()}`);
            setTimeout(() => setSecurityWarning(null), 5000);
        };

        // 1. Prevent right-click/context menu
        const preventContextMenu = (e) => {
            e.preventDefault();
            showWarning("Right-click is disabled for security purposes");
        };
        viewerElement.addEventListener('contextmenu', preventContextMenu);
        
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
        window.addEventListener('keyup', preventHotkeys); // Also check keyup for PrintScreen

        // 3. Copy/Paste blocking
        const preventCopy = (e) => {
            e.preventDefault();
            showWarning("Copying content is not allowed");
        };
        const preventCut = (e) => {
            e.preventDefault();
            showWarning("Cutting content is not allowed");
        };
        viewerElement.addEventListener('copy', preventCopy);
        viewerElement.addEventListener('cut', preventCut);
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
        viewerElement.addEventListener('drag', preventDrag);
        viewerElement.addEventListener('dragstart', preventDragStart);
        viewerElement.addEventListener('dragend', preventDrag);
        viewerElement.addEventListener('drop', preventDrag);

        // 5. Selection prevention (additional layer)
        const preventSelection = (e) => {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
        };
        viewerElement.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });
        viewerElement.addEventListener('mousedown', preventSelection);

        // 6. DevTools detection (checks if console is open)
        const detectDevTools = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                showWarning("Developer tools detected - Document access is being monitored");
            }
        };
        
        // Check immediately and then periodically
        detectDevTools();
        devToolsCheckInterval.current = setInterval(detectDevTools, 1000);

        // 7. Visibility change detection (tab switching, potential screenshot tools)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.warn("[SECURITY] User switched away from document - Potential screenshot attempt");
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 8. Apply CSS to suppress print content and prevent selection
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'pdf-security-style';
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
            .react-pdf__Page__canvas {
                user-select: none !important;
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                pointer-events: auto !important;
                -webkit-touch-callout: none !important;
            }
            .react-pdf__Page {
                user-select: none !important;
                -webkit-user-select: none !important;
            }
        `;
        document.head.appendChild(style);

        // Cleanup
        return () => {
            viewerElement.removeEventListener('contextmenu', preventContextMenu);
            window.removeEventListener('keydown', preventHotkeys);
            window.removeEventListener('keyup', preventHotkeys);
            viewerElement.removeEventListener('copy', preventCopy);
            viewerElement.removeEventListener('cut', preventCut);
            document.removeEventListener('copy', preventCopy);
            document.removeEventListener('cut', preventCut);
            viewerElement.removeEventListener('drag', preventDrag);
            viewerElement.removeEventListener('dragstart', preventDragStart);
            viewerElement.removeEventListener('dragend', preventDrag);
            viewerElement.removeEventListener('drop', preventDrag);
            viewerElement.removeEventListener('selectstart', preventSelection);
            viewerElement.removeEventListener('mousedown', preventSelection);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            
            if (devToolsCheckInterval.current) {
                clearInterval(devToolsCheckInterval.current);
            }
            
            const existingStyle = document.getElementById('pdf-security-style');
            if(existingStyle) document.head.removeChild(existingStyle);
        };
    }, []); 


    // --- 5. Navigation Handlers ---
    const goToPrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const goToNextPage = () => setCurrentPage(p => Math.min(numPages, p + 1));


    // --- RENDER LOGIC ---

    // Full-screen container class with higher z-index for mobile
    const containerClass = isFullScreen
        ? "fixed inset-0 w-full h-full z-[9999] bg-gray-900 overflow-hidden flex flex-col"
        : "flex flex-col h-full";


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-600">
                <Loader2 className="animate-spin mr-3" size={28} />
                <p className="text-lg font-medium">Loading document...</p>
            </div>
        );
    }

    if (loadError || !pdfUrl) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-center px-4">
                <span className="material-icons-round text-red-500 text-5xl mb-4">error_outline</span>
                <p className="text-xl font-semibold text-red-600 mb-2">Failed to load PDF</p>
                <p className="text-sm text-gray-500">{loadError || "Unable to load the document"}</p>
            </div>
        );
    }

    return (
        <>
            {/* Security Warning Toast */}
            {securityWarning && (
                <SecurityWarning 
                    message={securityWarning} 
                    onClose={() => setSecurityWarning(null)} 
                />
            )}
            
            {/* The main container for fullscreen API */}
            <div ref={viewerRef} className={containerClass}>

            {/* --- TOP TOOLBAR (Professional Look) --- */}
            <div className={`flex justify-between items-center px-2 md:px-3 py-2 md:py-3 transition-all ${isFullScreen ? 'bg-gray-800 text-white shadow-lg shrink-0' : 'bg-white border-b border-gray-200'}`}>
                
                {/* Page Navigation */}
                <div className="flex items-center space-x-1 md:space-x-2">
                    <ViewerButton 
                        icon={ChevronLeft} 
                        onClick={goToPrevPage} 
                        title="Previous Page"
                        disabled={currentPage <= 1}
                        isFullScreen={isFullScreen}
                    />
                    <span className={`text-xs md:text-sm ${isFullScreen ? 'text-gray-300 font-mono' : 'text-gray-700 font-medium'}`}>
                        Page <strong>{currentPage}</strong> / <strong>{numPages}</strong>
                    </span>
                    <ViewerButton 
                        icon={ChevronRight} 
                        onClick={goToNextPage} 
                        title="Next Page"
                        disabled={currentPage >= numPages}
                        isFullScreen={isFullScreen}
                    />
                </div>

                {/* Full-Screen Button */}
                <ViewerButton
                    icon={isFullScreen ? Minimize : Maximize}
                    onClick={handleFullScreen}
                    title={isFullScreen ? "Exit Fullscreen (Esc)" : "View Fullscreen"}
                    isFullScreen={isFullScreen}
                />
            </div>

            {/* --- PDF CONTENT WRAPPER (Scrollable Area) --- */}
            <div ref={pageWrapperRef} className={`flex-1 flex justify-center items-start py-2 md:py-4 overflow-y-auto ${isFullScreen ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <Document 
                    file={pdfUrl} 
                    onLoadSuccess={({ numPages }) => {
                        setNumPages(numPages);
                        setCurrentPage(1);
                        setLoadError(null);
                    }}
                    onLoadError={(error) => {
                        console.error("PDF Load Error:", error);
                        setLoadError("Failed to render PDF document");
                    }}
                    loading={
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="animate-spin mr-2" size={24} />
                            <span className={isFullScreen ? 'text-white' : 'text-gray-600'}>
                                Rendering PDF...
                            </span>
                        </div>
                    }
                    error={
                        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                            <span className="material-icons-round text-red-500 text-4xl mb-2">error</span>
                            <p className={`font-semibold ${isFullScreen ? 'text-white' : 'text-red-600'}`}>
                                Error loading PDF
                            </p>
                        </div>
                    }
                >
                    <Page
                        pageNumber={currentPage}
                        width={pageWidth}
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        className="shadow-2xl transition-shadow duration-300"
                        loading={
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="animate-spin" size={24} />
                            </div>
                        }
                        error={
                            <div className="flex flex-col items-center justify-center py-8">
                                <span className="material-icons-round text-red-500 text-3xl">error</span>
                                <p className="text-sm text-red-600 mt-2">Failed to render page</p>
                            </div>
                        }
                    />
                </Document>
            </div>
        </div>
        </>
    );
};

export default PdfViewer;