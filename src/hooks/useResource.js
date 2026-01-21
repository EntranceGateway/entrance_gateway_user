import { useState, useEffect, useCallback, useRef } from "react";
import { 
  fetchResourcePreview, 
  downloadResource, 
  checkResourceExists 
} from "../http/resources";

/**
 * Custom hook for resource file management
 * Handles preview, download, and cleanup with automatic memory management
 * 
 * @param {string} fileName - Name of the resource file
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoLoad - Auto-fetch on mount (default: false)
 * @param {boolean} options.autoCleanup - Auto-cleanup on unmount (default: true)
 * 
 * @returns {Object} Resource state and methods
 * 
 * @example
 * const { url, loading, error, preview, download } = useResource("image.jpg", {
 *   autoLoad: true
 * });
 * 
 * return <img src={url} alt="Preview" />;
 */
const useResource = (fileName, options = {}) => {
  const {
    autoLoad = false,
    autoCleanup = true,
  } = options;

  // State
  const [url, setUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Refs for cleanup and cancellation
  const abortControllerRef = useRef(null);
  const urlRef = useRef(null);

  /**
   * Cleanup object URL to prevent memory leaks
   */
  const cleanup = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
      setUrl(null);
    }
    setBlob(null);
  }, []);

  /**
   * Cancel ongoing request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Preview/load the resource file
   */
  const preview = useCallback(async () => {
    if (!fileName) {
      setError("File name is required");
      return null;
    }

    try {
      // Cancel any ongoing request
      cancel();
      
      // Cleanup previous URL
      cleanup();

      setLoading(true);
      setError(null);

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      const result = await fetchResourcePreview(fileName, {
        signal: abortControllerRef.current.signal,
      });

      // Store the URL ref for cleanup
      urlRef.current = result.url;

      setUrl(result.url);
      setBlob(result.blob);
      setMimeType(result.mimeType);
      setFileSize(result.size);

      return result;
    } catch (err) {
      // Don't set error for cancelled requests
      if (err.message !== "Request was cancelled") {
        setError(err.message);
      }
      return null;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [fileName, cancel, cleanup]);

  /**
   * Download the resource file
   */
  const download = useCallback(async (customName) => {
    if (!fileName) {
      setError("File name is required");
      return null;
    }

    try {
      cancel();
      
      setLoading(true);
      setError(null);
      setDownloadProgress(0);

      abortControllerRef.current = new AbortController();

      const result = await downloadResource(
        fileName, 
        customName, 
        {
          signal: abortControllerRef.current.signal,
          onProgress: setDownloadProgress,
        }
      );

      setDownloadProgress(100);
      return result;
    } catch (err) {
      if (err.message !== "Download was cancelled") {
        setError(err.message);
      }
      return null;
    } finally {
      setLoading(false);
      setDownloadProgress(0);
      abortControllerRef.current = null;
    }
  }, [fileName, cancel]);

  /**
   * Check if resource exists
   */
  const checkExists = useCallback(async () => {
    if (!fileName) return { exists: false };

    try {
      const result = await checkResourceExists(fileName);
      return result;
    } catch (err) {
      setError(err.message);
      return { exists: false };
    }
  }, [fileName]);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    cancel();
    cleanup();
    setError(null);
    setLoading(false);
    setMimeType(null);
    setFileSize(null);
    setDownloadProgress(0);
  }, [cancel, cleanup]);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad && fileName) {
      preview();
    }
  }, [autoLoad, fileName, preview]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoCleanup) {
        cancel();
        cleanup();
      }
    };
  }, [autoCleanup, cancel, cleanup]);

  return {
    // State
    url,
    blob,
    mimeType,
    fileSize,
    loading,
    error,
    downloadProgress,
    
    // Methods
    preview,
    download,
    checkExists,
    cleanup,
    cancel,
    reset,
  };
};

export default useResource;
