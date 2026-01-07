import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Share2,
  ChevronLeft,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getNoticeById, getNoticeFile } from "../../http/notices";

const NoticeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Fetch notice details and image
  useEffect(() => {
    const loadNoticeAndImage = async () => {
      try {
        setError("");
        setLoading(true);

        // Fetch notice details
        const noticeRes = await getNoticeById(id);
        const noticeData = noticeRes?.data || noticeRes;
        setNotice(noticeData);

        // Fetch notice image
        if (id) {
          try {
            setImageLoading(true);
            const imageBlob = await getNoticeFile(id);
            const url = URL.createObjectURL(imageBlob);
            setImageUrl(url);
          } catch (imgErr) {
            console.warn("Failed to load notice image:", imgErr);
          } finally {
            setImageLoading(false);
          }
        }
      } catch (err) {
        setError(err?.message || "Failed to load notice");
        setNotice(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadNoticeAndImage();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fullscreen handler
  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen && imageContainerRef.current) {
        if (imageContainerRef.current.requestFullscreen) {
          await imageContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else if (isFullscreen) {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      }
      if (e.key === "+") {
        e.preventDefault();
        setZoom((z) => Math.min(z + 0.2, 3));
      }
      if (e.key === "-") {
        e.preventDefault();
        setZoom((z) => Math.max(z - 0.2, 0.5));
      }
      if (e.key === "0") {
        e.preventDefault();
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isFullscreen]);

  // Mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e) => {
      if (!imageRef.current || !imageUrl) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((z) => Math.min(Math.max(z + delta, 0.5), 3));
    };

    const container = imageContainerRef.current;
    if (container && imageUrl) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, [imageUrl]);

  // Image drag handler
  const handleMouseDown = (e) => {
    if (zoom <= 1 || !imageUrl) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Limit drag bounds
    const container = imageContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    const maxX = (imageRect.width - containerRect.width) / 2;
    const maxY = (imageRect.height - containerRect.height) / 2;

    setOffset({
      x: Math.max(Math.min(newX, maxX), -maxX),
      y: Math.max(Math.min(newY, maxY), -maxY),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach mouse move/up listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, offset]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full opacity-30 animate-pulse blur-xl" />
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600" />
            </div>
            <p className="text-slate-600 font-semibold text-lg">Loading notice…</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-xl
                         bg-white border border-slate-200 hover:border-slate-300
                         text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Notices
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl border-2 border-red-200 bg-red-50/80 backdrop-blur-sm"
            >
              <div className="flex gap-4">
                <AlertCircle className="w-8 h-8 text-red-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-red-900 text-lg">Error Loading Notice</h3>
                  <p className="text-red-800 mt-2">{error}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!notice) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-xl
                         bg-white border border-slate-200 hover:border-slate-300
                         text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Notices
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-slate-600">Notice not found</p>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 mb-10 px-5 py-2.5 rounded-xl
                       bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md
                       text-slate-700 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Notices
          </motion.button>

          {/* Main Content Card */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/60 hover:shadow-2xl transition-all ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
            }`}
          >
            {/* Image Section - Enhanced with Controls */}
            <motion.div
              ref={imageContainerRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`relative w-full bg-linear-to-br from-slate-100 to-slate-200 group ${
                isFullscreen ? "h-screen flex items-center justify-center bg-black" : "overflow-hidden"
              }`}
            >
              {imageLoading && !imageUrl ? (
                <div className={`${isFullscreen ? "w-full h-full" : "aspect-video"} flex items-center justify-center bg-slate-100`}>
                  <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
                </div>
              ) : imageUrl ? (
                <div 
                  className={`relative w-full h-full flex items-center justify-center ${isFullscreen ? "overflow-hidden" : ""}`}
                  onMouseDown={handleMouseDown}
                  style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
                >
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt={notice?.title || "Notice image"}
                    style={{
                      transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                      transition: isDragging ? "none" : "transform 0.2s ease-in-out",
                    }}
                    className={`${isFullscreen ? "" : "max-h-96"} object-contain select-none`}
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block p-4 bg-slate-200 rounded-2xl mb-3">
                      <ImageIcon className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No image available</p>
                  </div>
                </div>
              )}

              {/* Image Controls Toolbar */}
              {imageUrl && (
                <motion.div
                  className={`absolute ${isFullscreen ? "bottom-6 left-1/2 -translate-x-1/2" : "top-4 right-4"} z-30`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className={`flex items-center gap-2 ${isFullscreen ? "bg-slate-900/90 backdrop-blur-xl border border-slate-700/50" : "bg-white/90 backdrop-blur-md border border-slate-200"} rounded-full p-2 shadow-lg`}>
                    {/* Zoom Controls */}
                    <button
                      onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
                      className={`p-2.5 rounded-full transition-all active:scale-90 ${
                        isFullscreen
                          ? "hover:bg-slate-700 text-slate-200"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                      title="Zoom out (-))"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>

                    <div className={`px-3 py-1 rounded-lg text-xs font-bold tabular-nums ${
                      isFullscreen ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-700"
                    }`}>
                      {Math.round(zoom * 100)}%
                    </div>

                    <button
                      onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
                      className={`p-2.5 rounded-full transition-all active:scale-90 ${
                        isFullscreen
                          ? "hover:bg-slate-700 text-slate-200"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                      title="Zoom in (+)"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>

                    <div className={`h-6 w-px ${isFullscreen ? "bg-slate-700" : "bg-slate-200"}`} />

                    <button
                      onClick={() => setZoom(1)}
                      className={`p-2.5 rounded-full transition-all active:scale-90 ${
                        isFullscreen
                          ? "hover:bg-slate-700 text-slate-200"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                      title="Reset zoom (0)"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    <div className={`h-6 w-px ${isFullscreen ? "bg-slate-700" : "bg-slate-200"}`} />

                    <button
                      onClick={toggleFullscreen}
                      className={`p-2.5 rounded-full transition-all active:scale-90 ${
                        isFullscreen
                          ? "text-rose-400 hover:bg-rose-900/30"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                      title="Toggle fullscreen (Esc to exit)"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-5 h-5" />
                      ) : (
                        <Maximize2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Fullscreen Hint */}
              {imageUrl && !isFullscreen && (
                <div className="absolute bottom-4 left-4 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Scroll to zoom • Drag to move • Fullscreen to expand
                </div>
              )}
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-8 md:p-12"
            >
              {/* Meta Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest
                             text-blue-700 bg-linear-to-r from-blue-50 to-blue-100 rounded-full
                             border border-blue-200 shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  Notice
                </motion.span>
                {notice?.createdDate && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest
                               text-slate-700 bg-slate-100 rounded-full border border-slate-200 shadow-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    {formatDate(notice.createdDate)}
                  </motion.span>
                )}
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight"
              >
                {notice?.title || "Untitled Notice"}
              </motion.h1>

              {/* Description/Content */}
              {notice?.description && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-10 pb-10 border-b border-slate-200"
                >
                  <div className="bg-blue-50/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-100/50">
                    <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                      {notice.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Footer CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={() => navigate(-1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                           bg-linear-to-r from-slate-900 to-slate-800 text-white font-bold
                           hover:shadow-lg transition-all shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to List
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
                           bg-white border-2 border-slate-200 text-slate-700 font-bold
                           hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.article>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NoticeDetails;
