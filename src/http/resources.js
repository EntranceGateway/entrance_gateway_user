import api from "./index";

/**
 * Resource API Service
 * Handles file retrieval from the backend resource endpoint
 * 
 * Endpoint: GET /resources/{fileName}
 * 
 * @module resources
 */

/**
 * Supported file types and their MIME types
 */
export const FILE_TYPES = {
  // Images
  IMAGE_JPEG: "image/jpeg",
  IMAGE_PNG: "image/png",
  IMAGE_GIF: "image/gif",
  IMAGE_WEBP: "image/webp",
  IMAGE_SVG: "image/svg+xml",
  
  // Documents
  PDF: "application/pdf",
  
  // Videos
  VIDEO_MP4: "video/mp4",
  VIDEO_WEBM: "video/webm",
  
  // Audio
  AUDIO_MP3: "audio/mpeg",
  AUDIO_WAV: "audio/wav",
};

/**
 * File type categories for easier handling
 */
export const FILE_CATEGORIES = {
  IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  VIDEO: ["video/mp4", "video/webm", "video/ogg"],
  AUDIO: ["audio/mpeg", "audio/wav", "audio/ogg"],
  DOCUMENT: ["application/pdf"],
};

/**
 * Check if MIME type is an image
 */
export const isImage = (mimeType) => FILE_CATEGORIES.IMAGE.includes(mimeType);

/**
 * Check if MIME type is a video
 */
export const isVideo = (mimeType) => FILE_CATEGORIES.VIDEO.includes(mimeType);

/**
 * Check if MIME type is audio
 */
export const isAudio = (mimeType) => FILE_CATEGORIES.AUDIO.includes(mimeType);

/**
 * Check if MIME type is a document (PDF)
 */
export const isDocument = (mimeType) => FILE_CATEGORIES.DOCUMENT.includes(mimeType);

/**
 * Fetch resource file as blob for preview/display
 * 
 * @param {string} fileName - Name of the file to fetch (will be URL encoded)
 * @param {Object} options - Additional options
 * @param {AbortSignal} options.signal - AbortController signal for cancellation
 * @returns {Promise<{blob: Blob, url: string, mimeType: string, fileName: string, size: number}>}
 * 
 * @example
 * const { blob, url, mimeType } = await fetchResourcePreview("my-image.jpg");
 * // Use url in <img src={url} />
 * // Remember to revoke: URL.revokeObjectURL(url)
 */
export const fetchResourcePreview = async (fileName, options = {}) => {
  if (!fileName) {
    throw new Error("File name is required");
  }

  try {
    // URL encode the filename to handle spaces and special characters
    const encodedFileName = encodeURIComponent(fileName);
    const endpoint = `/resources/${encodedFileName}`;
    
    const response = await api.get(endpoint, {
      responseType: "blob",
      signal: options.signal,
      headers: {
        Accept: "*/*",
      },
    });

    // Extract metadata from response headers
    const contentType = response.headers["content-type"] || "application/octet-stream";
    const contentDisposition = response.headers["content-disposition"];
    const contentLength = response.headers["content-length"];
    
    // Try to extract original filename from Content-Disposition header
    let originalFileName = fileName;
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        originalFileName = matches[1].replace(/['"]/g, "");
      }
    }

    // Create object URL for preview
    const blob = response.data;
    const objectUrl = URL.createObjectURL(blob);

    return {
      blob,
      url: objectUrl,
      mimeType: contentType,
      fileName: originalFileName,
      size: contentLength ? parseInt(contentLength, 10) : blob.size,
    };
  } catch (error) {
    // Enhanced error handling
    if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
      throw new Error("Request was cancelled");
    }
    
    if (error.response?.status === 404) {
      throw new Error(`File not found: ${fileName}`);
    }
    
    if (error.response?.status === 500) {
      throw new Error("Server error while fetching file");
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to fetch resource"
    );
  }
};

/**
 * Download resource file directly
 * Triggers browser download dialog
 * 
 * @param {string} fileName - Name of the file to download
 * @param {string} downloadName - Optional custom name for downloaded file
 * @param {Object} options - Additional options
 * @param {AbortSignal} options.signal - AbortController signal for cancellation
 * @param {Function} options.onProgress - Progress callback (percent: number) => void
 * 
 * @example
 * await downloadResource("document.pdf", "My Document.pdf", {
 *   onProgress: (percent) => console.log(`Downloaded: ${percent}%`)
 * });
 */
export const downloadResource = async (fileName, downloadName, options = {}) => {
  if (!fileName) {
    throw new Error("File name is required");
  }

  try {
    const encodedFileName = encodeURIComponent(fileName);
    
    const response = await api.get(`/resources/${encodedFileName}`, {
      responseType: "blob",
      signal: options.signal,
      headers: {
        Accept: "*/*",
      },
      onDownloadProgress: (progressEvent) => {
        if (options.onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          options.onProgress(percent);
        }
      },
    });

    // Create blob and trigger download
    const blob = response.data;
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName || fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      fileName: downloadName || fileName,
      size: blob.size,
    };
  } catch (error) {
    if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
      throw new Error("Download was cancelled");
    }
    
    if (error.response?.status === 404) {
      throw new Error(`File not found: ${fileName}`);
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to download resource"
    );
  }
};

/**
 * Check if resource exists (HEAD request)
 * Useful for validation before attempting download/preview
 * 
 * @param {string} fileName - Name of the file to check
 * @returns {Promise<{exists: boolean, size?: number, mimeType?: string}>}
 * 
 * @example
 * const { exists, size, mimeType } = await checkResourceExists("image.jpg");
 * if (exists) {
 *   console.log(`File exists: ${size} bytes, type: ${mimeType}`);
 * }
 */
export const checkResourceExists = async (fileName) => {
  if (!fileName) {
    throw new Error("File name is required");
  }

  try {
    const encodedFileName = encodeURIComponent(fileName);
    
    const response = await api.head(`/resources/${encodedFileName}`);
    
    return {
      exists: true,
      size: response.headers["content-length"] 
        ? parseInt(response.headers["content-length"], 10) 
        : undefined,
      mimeType: response.headers["content-type"],
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return { exists: false };
    }
    
    throw new Error("Failed to check resource existence");
  }
};

/**
 * Utility to format file size for display
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file extension from filename
 * 
 * @param {string} fileName - File name
 * @returns {string} File extension (lowercase, without dot)
 */
export const getFileExtension = (fileName) => {
  if (!fileName) return "";
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

/**
 * Get appropriate icon name for file type
 * 
 * @param {string} mimeType - MIME type of file
 * @returns {string} Icon name (for lucide-react or similar)
 */
export const getFileIcon = (mimeType) => {
  if (isImage(mimeType)) return "Image";
  if (isVideo(mimeType)) return "Video";
  if (isAudio(mimeType)) return "Music";
  if (isDocument(mimeType)) return "FileText";
  return "File";
};
