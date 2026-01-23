import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "https://api.entrancegateway.com/api/v1",
});

// In-memory storage for access token (more secure than localStorage)
let accessToken = null;

// Flag to track if auth is being initialized (prevents redirect during startup)
let isInitializing = false;

// Getter and setter for access token (used by auth slice)
export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
  accessToken = token;
};

// Set initializing state (called during app startup)
export const setIsInitializing = (value) => {
  isInitializing = value;
};

// Clear all auth tokens (used for logout)
export const clearTokens = () => {
  accessToken = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("tokenType");
  localStorage.removeItem("expiresIn");
  localStorage.removeItem("token"); // Also clear old token key
};

// Request interceptor - attach access token to all requests
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor - handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for refresh-token endpoint itself to prevent loops
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // No refresh token available
      if (!refreshToken) {
        isRefreshing = false;
        // Only clear tokens if not during initialization
        if (!isInitializing) {
          clearTokens();
          // Don't redirect here - let ProtectedRoute handle it
        }
        return Promise.reject(error);
      }

      try {
        // Call refresh token endpoint using fresh axios (not the intercepted api)
        const response = await axios.post(
          "https://api.entrancegateway.com/api/v1/auth/refresh-token",
          { refreshToken }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Update tokens in memory and localStorage
        setAccessToken(newAccessToken);
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Process queued requests with new token
        processQueue(null, newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens
        processQueue(refreshError, null);
        clearTokens();
        
        // Don't redirect here - let ProtectedRoute handle it
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
