import React, { useEffect, useState, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// Importing professional icons from lucide-react
import { Loader2, Maximize, Minimize, ChevronLeft, ChevronRight } from 'lucide-react'; 

// Configure the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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

const PdfViewer = ({ noteId, token, fetchPdfBlob, suburl }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageWidth, setPageWidth] = useState(800);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const viewerRef = useRef(null); 
    const pageWrapperRef = useRef(null); 

    // --- 1. Load PDF Blob ---
    useEffect(() => {
        const loadPdf = async () => {
            setIsLoading(true);
            try {
                // Revoke previous object URL before fetching a new one
                if (pdfUrl) URL.revokeObjectURL(pdfUrl); 

                const blob = await fetchPdfBlob(`${suburl}/${noteId}`, token);
                const newPdfUrl = URL.createObjectURL(blob);
                setPdfUrl(newPdfUrl);

            } catch (error) {
                console.error("Failed to load PDF:", error);
                setPdfUrl(null); 
            } finally {
                setIsLoading(false);
            }
        };
        
        loadPdf();

        // Cleanup: revoke the object URL when the component unmounts
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [noteId, token, fetchPdfBlob, suburl]);


    // --- 2. Handle Responsiveness and Page Width ---
    const calculatePageWidth = useCallback(() => {
        if (pageWrapperRef.current) {
            // Calculate width based on container size and fullscreen state
            const padding = isFullScreen ? 40 : 16; // Adjust padding for fullscreen vs windowed
            const width = pageWrapperRef.current.clientWidth - padding;
            setPageWidth(width);
        }
    }, [isFullScreen]);

    useEffect(() => {
        calculatePageWidth();
        window.addEventListener("resize", calculatePageWidth);
        return () => window.removeEventListener("resize", calculatePageWidth);
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
            calculatePageWidth(); 
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
    }, [calculatePageWidth]);

    // --- 4. Anti-Download/Print Measures ---
    useEffect(() => {
        if (!viewerRef.current) return;

        // Prevent right-click/context menu (specific to the viewer element)
        const viewerElement = viewerRef.current;
        const preventContextMenu = (e) => e.preventDefault();
        viewerElement.addEventListener('contextmenu', preventContextMenu);
        
        // Disable common print/save keyboard shortcuts (global)
        const preventHotkeys = (e) => {
            // Ctrl+P / Cmd+P (Print) or Ctrl+S / Cmd+S (Save)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
                e.preventDefault();
                console.warn("Download/Print is restricted."); // Log instead of alert for better UX
            }
        };

        window.addEventListener('keydown', preventHotkeys);

        // Apply CSS to suppress print content
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'print-guard-style';
        style.innerHTML = `
            @media print {
                body * {
                    display: none !important;
                }
                .pdf-viewer-container {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        return () => {
            viewerElement.removeEventListener('contextmenu', preventContextMenu);
            window.removeEventListener('keydown', preventHotkeys);
            const existingStyle = document.getElementById('print-guard-style');
            if(existingStyle) document.head.removeChild(existingStyle);
        };
    }, []); 


    // --- 5. Navigation Handlers ---
    const goToPrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const goToNextPage = () => setCurrentPage(p => Math.min(numPages, p + 1));


    // --- RENDER LOGIC ---

    // Full-screen container class
    const containerClass = isFullScreen
        ? "fixed top-0 left-0 w-full h-full z-[1000] bg-gray-900 overflow-hidden flex flex-col"
        : "flex flex-col h-full";


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-600">
                <Loader2 className="animate-spin mr-3" size={28} />
                <p className="text-lg font-medium">Loading document...</p>
            </div>
        );
    }

    if (!pdfUrl) {
        return <p className="text-center py-10 text-xl font-semibold text-red-600">Failed to load PDF document.</p>;
    }

    return (
        // The main container for fullscreen API
        <div ref={viewerRef} className={containerClass}>

            {/* --- TOP TOOLBAR (Professional Look) --- */}
            <div className={`flex justify-between items-center p-3 transition-all ${isFullScreen ? 'bg-gray-800 text-white shadow-lg shrink-0' : 'bg-white border-b border-gray-200'}`}>
                
                {/* Page Navigation */}
                <div className="flex items-center space-x-2">
                    <ViewerButton 
                        icon={ChevronLeft} 
                        onClick={goToPrevPage} 
                        title="Previous Page"
                        disabled={currentPage <= 1}
                        isFullScreen={isFullScreen}
                    />
                    <span className={isFullScreen ? "text-sm text-gray-300 font-mono" : "text-sm text-gray-700 font-medium"}>
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
            <div ref={pageWrapperRef} className={`flex-1 flex justify-center py-4 overflow-y-auto ${isFullScreen ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <Document 
                    file={pdfUrl} 
                    onLoadSuccess={({ numPages }) => {
                        setNumPages(numPages);
                        setCurrentPage(1); 
                    }}
                    onLoadError={(error) => console.error("PDF Load Error:", error)}
                    loading={''} // Hide default react-pdf internal loading text
                >
                    <Page
                        pageNumber={currentPage}
                        width={pageWidth}
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        className="shadow-2xl transition-shadow duration-300" // Enhanced shadow
                    />
                </Document>
            </div>
        </div>
    );
};

export default PdfViewer;