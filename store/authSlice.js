// store/authSlice.js

import { createSlice } from "@reduxjs/toolkit";
import api, { setAccessToken, clearTokens, setIsInitializing } from "../src/http";

// Status constants
export const STATUSES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const initialState = {
  user: null,
  status: STATUSES.IDLE,
  accessToken: null, // Stored in memory via http/index.js
  refreshToken: null,
  userId: null,
  tokenType: null,
  expiresIn: null,
  error: null,
  pendingEmail: null, // Stores email waiting for OTP verification
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    // Updated to handle full auth data from login response
    setAuthData(state, action) {
      const { userId, accessToken, refreshToken, tokenType, expiresIn } =
        action.payload;
      state.userId = userId;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.tokenType = tokenType;
      state.expiresIn = expiresIn;
    },
    setToken(state, action) {
      state.accessToken = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setPendingEmail(state, action) {
      state.pendingEmail = action.payload;
    },
    clearAuth(state) {
      return initialState; // Reset to initial state on logout
    },
    removeUserFromState(state, action) {
      if (Array.isArray(state.user)) {
        state.user = state.user.filter((u) => u.id !== action.payload);
      }
    },
  },
});

export const {
  setStatus,
  setUser,
  setAuthData,
  setToken,
  setUserId,
  setError,
  setPendingEmail,
  clearAuth,
  removeUserFromState,
} = authSlice.actions;

export default authSlice.reducer;

/**
 * Parse error response from API
 * Handles different error formats: validation errors, simple messages, etc.
 */
function parseErrorResponse(error) {
  const response = error.response?.data;
  
  if (!response) {
    return {
      message: error.message || "An error occurred. Please try again.",
      errors: null,
    };
  }

  // Handle validation errors (400 with errors object)
  if (response.errors && typeof response.errors === 'object') {
    return {
      message: response.message || "Validation failed",
      errors: response.errors, // { email: "...", password: "..." }
    };
  }

  // Handle simple message errors (401, 403, 404, 409)
  return {
    message: response.message || "An error occurred",
    errors: null,
  };
}

// Thunks
export function addAuth(data) {
  return async function (dispatch) {
    console.log("addAuth called with data:", data);
    dispatch(setStatus(STATUSES.LOADING));
    dispatch(setError(null));

    const { email } = data; // Extract email from form data

    try {
      const response = await api.post("/auth/user/register", data);

      console.log("API Response:", response);

      if (response.status === 200 || response.status === 201) {
        console.log("Registration successful! Awaiting OTP...");

        // Store email for OTP verification step
        dispatch(setPendingEmail(email));
        localStorage.setItem("pendingEmail", email);

        dispatch(setStatus(STATUSES.SUCCESS));
        return { success: true, data: response.data };
      } else {
        const errorData = response.data || { message: "Registration failed" };
        dispatch(setStatus(STATUSES.ERROR));
        dispatch(setError(errorData));
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error("API Error:", error);

      const errorData = parseErrorResponse(error);

      dispatch(setStatus(STATUSES.ERROR));
      dispatch(setError(errorData));

      return { success: false, error: errorData };
    }
  };
}

/**
 * Login thunk - authenticates user and stores JWT tokens
 * accessToken is stored in memory (via setAccessToken)
 * refreshToken is stored in localStorage for persistence
 */
export function login(data) {
  return async function (dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    dispatch(setError(null));

    try {
      const response = await api.post("/auth/login", data);

      // Check for successful login with expected data structure
      if (response.status === 200 && response.data.data?.accessToken) {
        const { userId, accessToken, refreshToken, tokenType, expiresIn } =
          response.data.data;

        // Store accessToken in memory (more secure than localStorage)
        setAccessToken(accessToken);

        // Store tokens in localStorage for persistence across page reloads
        localStorage.setItem("accessToken", accessToken); // Backup for page refresh
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("tokenType", tokenType);
        localStorage.setItem("expiresIn", expiresIn);

        // Update Redux state with auth data
        dispatch(
          setAuthData({
            userId,
            accessToken,
            refreshToken,
            tokenType,
            expiresIn,
          })
        );

        // Clean up pending email on successful login
        dispatch(setPendingEmail(null));
        localStorage.removeItem("pendingEmail");

        dispatch(setStatus(STATUSES.SUCCESS));
        return { success: true, data: response.data };
      } else {
        // Unexpected response structure
        const errorData = response.data || { message: "Login failed" };
        dispatch(setStatus(STATUSES.ERROR));
        dispatch(setError(errorData.message || "Login failed"));
        return { success: false, error: errorData };
      }
    } catch (error) {
      // Parse error response
      const errorData = parseErrorResponse(error);

      dispatch(setStatus(STATUSES.ERROR));
      dispatch(setError(errorData));

      return { success: false, error: errorData };
    }
  };
}

/**
 * Logout thunk - clears all auth tokens and redirects to login
 * Optionally calls logout endpoint to invalidate refresh token on server
 */
export function logout() {
  return async function (dispatch) {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      // Optionally call logout endpoint to invalidate server-side token
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken }).catch(() => {
          // Ignore logout API errors - still proceed with local cleanup
        });
      }
    } finally {
      // Clear all tokens (memory + localStorage)
      clearTokens();

      // Reset Redux auth state
      dispatch(clearAuth());

      // Redirect to login page
      window.location.href = "/login";
    }
  };
}

/**
 * Initialize auth state from localStorage on app load
 * First tries to restore accessToken from localStorage
 * Falls back to refreshing via API if accessToken is expired/missing
 */
export function initializeAuth() {
  return async function (dispatch) {
    const storedAccessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("userId");

    // No stored session - user needs to login
    if (!refreshToken || !userId) {
      return { success: false, reason: "no_session" };
    }

    // Set flag to prevent interceptor redirects during initialization
    setIsInitializing(true);
    dispatch(setStatus(STATUSES.LOADING));

    // If we have a stored access token, try to use it directly
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      
      dispatch(
        setAuthData({
          userId: parseInt(userId, 10),
          accessToken: storedAccessToken,
          refreshToken,
          tokenType: localStorage.getItem("tokenType") || "Bearer",
          expiresIn: parseInt(localStorage.getItem("expiresIn"), 10) || 900,
        })
      );
      
      dispatch(setStatus(STATUSES.SUCCESS));
      setIsInitializing(false);
      return { success: true };
    }

    // No stored access token - try to refresh
    try {
      const response = await api.post("/auth/refresh-token", { refreshToken });

      if (response.status === 200 && response.data.data?.accessToken) {
        const {
          userId: newUserId,
          accessToken,
          refreshToken: newRefreshToken,
          tokenType,
          expiresIn,
        } = response.data.data;

        // Store new access token in memory and localStorage
        setAccessToken(accessToken);
        localStorage.setItem("accessToken", accessToken);

        // Update refresh token in localStorage (in case it was rotated)
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("userId", newUserId);
        localStorage.setItem("tokenType", tokenType);
        localStorage.setItem("expiresIn", expiresIn);

        // Update Redux state
        dispatch(
          setAuthData({
            userId: newUserId,
            accessToken,
            refreshToken: newRefreshToken,
            tokenType,
            expiresIn,
          })
        );

        dispatch(setStatus(STATUSES.SUCCESS));
        return { success: true };
      } else {
        // Unexpected response - clear session
        clearTokens();
        dispatch(clearAuth());
        dispatch(setStatus(STATUSES.IDLE));
        return { success: false, reason: "invalid_response" };
      }
    } catch (error) {
      console.error("Session restore failed:", error);
      // Refresh token expired or invalid - clear session
      clearTokens();
      dispatch(clearAuth());
      dispatch(setStatus(STATUSES.IDLE));
      return { success: false, reason: "refresh_failed" };
    } finally {
      // Always clear initializing flag when done
      setIsInitializing(false);
    }
  };
}

// Clear pending email after OTP verification
export function clearPendingEmail() {
  return (dispatch) => {
    dispatch(setPendingEmail(null));
    localStorage.removeItem("pendingEmail");
  };
}