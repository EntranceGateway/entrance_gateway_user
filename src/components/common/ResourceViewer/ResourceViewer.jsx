import { useEffect } from "react";
import { Download, X, Loader2, AlertCircle, FileText, Image as ImageIcon, Video, Music } from "lucide-react";
import useResource from "../../../hooks/useResource";
import { 
  isImage, 
  isVideo, 
  isAudio, 
  isDocument, 
  formatFileSize 
} from "../../../http/resources";

/**
 * ResourceViewer - Universal component for previewing resource files
 * Automatically handles images, videos, audio, and PDFs
 * 
 * @param {Object} props
 * @param {string} props.fileName - Name of the resource file
 * @param {string} props.alt - Alt text for images
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showDownload - Show download button (default: true)
 * @param {boolean} props.showFileName - Show file name (default: true)
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onLoad - Load success callback
 * @param {Function} props.onError - Error callback
 * 
 * @example
 * <ResourceViewer 
 *   fileName="my-image.jpg" 
 *   alt="Product image"
 *   showDownload={true}
 * />
 */
const ResourceViewer = ({
  fileName,
  alt = "Resource preview",
  className = "",
  showDownload = true,
  showFileName = true,
  onClose,
  onLoad,
  onError,
}) => {
  const {
    url,
    mimeType,
    fileSize,
    loading,
    error,
    downloadProgress,
    preview,
    download,
  } = useResource(fileName, { autoLoad: true });

  // Notify parent on load/error
  useEffect(() => {
    if (url && onLoad) {
      onLoad({ url, mimeType, fileSize });
    }
  }, [url, mimeType, fileSize, onLoad]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Handle download
  const handleDownload = async () => {
    await download();
  };

  // Render loading state
  if (loading && !url) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg ${className}`}>
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-sm text-gray-600">Loading resource...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200 ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
        <p className="text-sm font-medium text-red-900 mb-1">Failed to load resource</p>
        <p className="text-xs text-red-600 mb-4">{error}</p>
        <button
          onClick={preview}
          className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No URL yet
  if (!url) {
    return null;
  }

  // Render based on file type
  return (
    <div className={`relative bg-white rounded-lg overflow-hidden ${className}`}>
      {/* Header with file info and actions */}
      {(showFileName || showDownload || onClose) && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {mimeType && (
              <div className="flex-shrink-0">
                {isImage(mimeType) && <ImageIcon className="w-4 h-4 text-blue-600" />}
                {isVideo(mimeType) && <Video className="w-4 h-4 text-purple-600" />}
                {isAudio(mimeType) && <Music className="w-4 h-4 text-green-600" />}
                {isDocument(mimeType) && <FileText className="w-4 h-4 text-red-600" />}
              </div>
            )}
            {showFileName && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                {fileSize && (
                  <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {showDownload && (
              <button
                onClick={handleDownload}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                title="Download"
              >
                {downloadProgress > 0 && downloadProgress < 100 ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="relative">
        {/* Image */}
        {mimeType && isImage(mimeType) && (
          <img
            src={url}
            alt={alt}
            className="w-full h-auto max-h-[600px] object-contain"
            loading="lazy"
          />
        )}

        {/* Video */}
        {mimeType && isVideo(mimeType) && (
          <video
            src={url}
            controls
            className="w-full h-auto max-h-[600px]"
            preload="metadata"
          >
            Your browser does not support video playback.
          </video>
        )}

        {/* Audio */}
        {mimeType && isAudio(mimeType) && (
          <div className="p-8 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
            <audio
              src={url}
              controls
              className="w-full max-w-md"
              preload="metadata"
            >
              Your browser does not support audio playback.
            </audio>
          </div>
        )}

        {/* PDF */}
        {mimeType && isDocument(mimeType) && (
          <iframe
            src={url}
            title={fileName}
            className="w-full h-[600px] border-0"
          />
        )}

        {/* Unsupported type */}
        {mimeType && !isImage(mimeType) && !isVideo(mimeType) && !isAudio(mimeType) && !isDocument(mimeType) && (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">
              Preview not available for this file type
            </p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceViewer;
