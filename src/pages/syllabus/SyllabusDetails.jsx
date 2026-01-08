import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Fullscreen,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Lock,
  Loader2,
  FileText,
  ShieldCheck,
  Share2,
  BookOpen,
  Info
} from "lucide-react";
// Import your API functions here
import { fetchPdfBlob, fetchRelatedNotes, fetchNoteDetails } from "../../http/notes"; 
import DashboardLayout from "../../components/layout/DashboardLayout";
import PdfViewer from "../../components/common/pdf/PdfViewer";
import api from "../../http";

// Configure PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// --- 1. Sub-Component: Loading Spinner ---
const ViewerLoader = () => (
  <div className="flex flex-col items-center justify-center h-[600px] w-full bg-slate-50/50 rounded-xl border border-slate-200 backdrop-blur-sm">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
    </div>
    <p className="mt-4 text-slate-500 font-medium animate-pulse">Securely loading document...</p>
  </div>
);

// --- 2. Sub-Component: Floating Toolbar (Google Drive Style) ---
const ViewerToolbar = ({ 
  pageNumber, 
  numPages, 
  scale, 
  setScale, 
  changePage, 
  isFullscreen, 
  toggleFullscreen 
}) => (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 w-[95%] max-w-md">
    <div className="backdrop-blur-xl bg-slate-900/90 shadow-2xl shadow-black/20 border border-slate-700/50 rounded-full p-2 flex items-center justify-between gap-2 text-slate-200">
      
      {/* Navigation */}
      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1}
          className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-30 transition-all active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="min-w-[70px] text-center text-sm font-bold font-mono text-white tracking-wider">
          {pageNumber} <span className="text-slate-500">/</span> {numPages}
        </span>
        <button
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages}
          className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-30 transition-all active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="h-6 w-px bg-slate-700 mx-1"></div>

      {/* Zoom */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))}
          className="p-2 rounded-full hover:bg-slate-700 transition-all active:scale-90"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale((s) => Math.min(s + 0.1, 2.5))}
          className="p-2 rounded-full hover:bg-slate-700 transition-all active:scale-90"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      <div className="h-6 w-px bg-slate-700 mx-1"></div>

      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        className={`p-2 rounded-full transition-all active:scale-90 pr-3 ${
            isFullscreen ? "text-rose-400 hover:bg-rose-900/30" : "hover:bg-slate-700"
        }`}
      >
        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Fullscreen className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

// --- 3. Main Component: Secure PDF Viewer ---
const SecurePdfViewer = ({ noteId, token, fetchPdfBlob, suburl }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const localStorageKey = `cached_pdf_${noteId}`;

  // Fetching & Caching Logic
  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      try {
        const cachedPdfData = localStorage.getItem(localStorageKey);
        if (cachedPdfData) {
          try {
            const byteCharacters = atob(cachedPdfData);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
            setPdfUrl(URL.createObjectURL(blob));
            setLoading(false);
            return; 
          } catch (e) {
            console.warn("Cache corrupted, fetching fresh...");
            localStorage.removeItem(localStorageKey);
          }
        }

        const blob = await fetchPdfBlob(`${suburl}/${noteId}`, token);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            try {
                localStorage.setItem(localStorageKey, base64data);
            } catch (e) {
                console.warn("Storage full, could not cache PDF.");
            }
        };

      } catch (err) {
        console.error("Failed to load PDF:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); };
  }, [noteId, token, fetchPdfBlob, suburl]);

  const changePage = (offset) => {
    setPageNumber((prev) => Math.min(Math.max(prev + offset, 1), numPages));
  };

  // --- SECURITY ENFORCEMENT ---
  useEffect(() => {
    const handleKeydown = (e) => {
      if (
        (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u' || e.key === 'c')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      if (e.key === "ArrowRight") changePage(1);
      if (e.key === "ArrowLeft") changePage(-1);
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };

    window.addEventListener("keydown", handleKeydown);
    document.addEventListener("contextmenu", (e) => e.preventDefault()); // Prevent Right Click

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, [numPages, isFullscreen]);

  if (loading) return <ViewerLoader />;
  if (!pdfUrl) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl">Document Unavailable</div>;

  return (
    <div 
      ref={containerRef}
      className={`relative transition-all duration-500 ease-in-out group ${
        isFullscreen 
          ? "fixed inset-0 z-50 bg-slate-900 h-screen w-screen flex flex-col items-center justify-center" 
          : "w-full bg-slate-900/5 rounded-2xl border border-slate-200/60 overflow-hidden shadow-2xl h-[85vh] min-h-[600px]"
      }`}
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
      onContextMenu={(e) => e.preventDefault()} // Added to prevent right click
    >
        <div className="flex-1 w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent flex justify-center py-10 px-4 bg-slate-50/50">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPageNumber(1); }}
            loading={<div className="text-slate-400 mt-10">Rendering pages...</div>}
            className="shadow-2xl shadow-black/10"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="bg-white" 
              canvasBackground="white"
            />
          </Document>
        </div>

        <ViewerToolbar 
            pageNumber={pageNumber}
            numPages={numPages}
            scale={scale}
            setScale={setScale}
            changePage={changePage}
            isFullscreen={isFullscreen}
            toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        />

        <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <div className="bg-white/80 backdrop-blur-md text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Protected View</span>
           </div>
        </div>
    </div>
  );
};

// --- 4. Main Page Component ---
const SyllabusDetails = () => {
  const { id } = useParams();
  const authToken = localStorage.getItem("token"); 
  const [relatedNotes, setRelatedNotes] = useState([]);
  const [noteDetails, setNoteDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    if (authToken) { 
      fetchRelatedNotes(authToken).then((res) => {
        setRelatedNotes(res.data || []); 
      }).catch(err => console.error(err));
    }
  }, [authToken]); 

  useEffect(() => {
    setLoadingDetails(true);
    if (authToken && id) {
        fetchNoteDetails(id, authToken) 
            .then(res => setNoteDetails(res.data))
            .catch(error => console.error(error))
            .finally(() => setLoadingDetails(false));
    } else {
        setLoadingDetails(false);
    }
  }, [id, authToken]); 

  if (loadingDetails) {
    return (
        <DashboardLayout>
            <div className="min-h-screen flex flex-col justify-center items-center bg-white">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-slate-600 font-medium">Retrieving academic resources...</p>
            </div>
        </DashboardLayout>
    );
  }

  const subjectName = noteDetails?.subject || "Academic Note";
  const courseName = noteDetails?.noteName ? noteDetails.noteName.split('_').pop().replace('.pdf', '') : "Study Material";

  return (
    <DashboardLayout>
      <div className="bg-white min-h-screen pb-20 pt-7 selection:bg-indigo-100" onContextMenu={(e) => e.preventDefault()}>
        
        {/* --- Header Section --- */}
        <section className="bg-white border-b border-slate-100 pt-8 pb-10 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
                            {courseName}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500 text-sm font-medium">Entrance Gateways</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                        {subjectName}
                    </h1>
                </div>
                
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 font-semibold transition-all shadow-sm group">
                        <Share2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                        Share
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-lg shadow-slate-200">
                        <BookOpen className="w-4 h-4" />
                        Start Reading
                    </button>
                </div>
            </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 mt-8 grid lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-8 space-y-8">
            
      <section className="max-w-6xl mx-auto px-2 mb-10">
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200">
          <PdfViewer
            noteId={id}
            token={authToken}
            fetchPdfBlob={fetchPdfBlob}
            suburl="/syllabus/getSyllabusFile"
          />
        </div>
      </section>
                <div className="prose prose-slate max-w-none">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Info className="w-5 h-5 text-indigo-600" />
                        About this material
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        <strong>Entrance Gateways</strong> provides comprehensive academic notes for 
                        <span className="font-semibold text-slate-900"> {subjectName}</span>. 
                        These notes are meticulously curated to support students in entrance examinations 
                        and university semesters, focusing on conceptual clarity and exam relevance.
                    </p>
                    
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 not-prose mt-6">
                        <h4 className="font-bold text-slate-900 mb-4">What's Inside?</h4>
                        <ul className="grid sm:grid-cols-2 gap-3">
                            {['Key Definitions', 'Revision Points', 'Solved Examples', 'Visual Diagrams', 'Exam Questions'].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <aside className="lg:col-span-4 space-y-8">
                
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sticky top-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Related Materials
                    </h2>
                    
                    <div className="space-y-4">
                        {relatedNotes.length > 0 ? relatedNotes.map((note) => (
                            <Link
                                key={note.id}
                                to={`/notes/${note.id}`}
                                onClick={() => window.location.reload()}
                                className="block group"
                            >
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                                    <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                        {note.title || "Untitled Note"}
                                    </h3>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>{note.courseName}</span>
                                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                                            Sem {note.semester}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="text-center py-8 text-slate-400 text-sm">
                                No related notes found.
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl">
                            <Lock className="w-5 h-5 text-indigo-400 mt-0.5" />
                            <p className="text-xs text-indigo-900/70 leading-relaxed">
                                Content is protected by <strong>Entrance Gateways</strong> security protocols. 
                                Printing and unauthorized distribution are disabled.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <div className="hidden">
           {subjectName} Notes, {courseName} Notes, Entrance Notes, University Exam Preparation Notes,
           Technical Subject Notes PDF
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SyllabusDetails;
