// store/authSlice.js

import { createSlice } from "@reduxjs/toolkit";
import api from "../src/http";

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
  token: null,
  userId: null,
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
    setToken(state, action) {
      state.token = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setPendingEmail(state, action) {
      state.pendingEmail = action.payload;
    },
    clearAuth(state) {
      return initialState; // Better than Object.assign for immutability
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
  setToken,
  setUserId,
  setError,
  setPendingEmail,
  clearAuth,
  removeUserFromState,
} = authSlice.actions;

export default authSlice.reducer;

// Thunks
export function addAuth(data) {
  return async function (dispatch) {
    console.log("addAuth called with data:", data);
    dispatch(setStatus(STATUSES.LOADING));
    dispatch(setError(null));

    const { email } = data; // Extract email from form data

    try {
      const response = await api.post("/api/v1/auth/user/register", data);

      console.log("API Response:", response);

      if (response.status === 200 || response.status === 201) {
        console.log("Registration successful! Awaiting OTP...");

        // Store email for OTP verification step
        dispatch(setPendingEmail(email));
        localStorage.setItem("pendingEmail", email); // Fixed typo: pendinemail → pendingEmail

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

      const errorData =
        error.response?.data ||
        { message: error.message || "Registration failed. Please try again." };

      dispatch(setStatus(STATUSES.ERROR));
      dispatch(setError(errorData));

      return { success: false, error: errorData };
    }
  };
}

export function login(data) {
  return async function (dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    dispatch(setError(null));

    try {
      const response = await api.post("/api/v1/auth/login", data);

      if (response.status === 200 && response.data.data?.token) {
        const { token, userId, user } = response.data.data;

        dispatch(setToken(token));
        dispatch(setUserId(userId));
        dispatch(setUser(user));

        // Optional: Clean up pending email on login
        dispatch(setPendingEmail(null));
        localStorage.removeItem("pendingEmail");

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        dispatch(setStatus(STATUSES.SUCCESS));
        return { success: true, data: response.data };
      } else {
        const errorData = response.data || { message: "Login failed" };
        dispatch(setStatus(STATUSES.ERROR));
        dispatch(setError(errorData));
        return { success: false, error: errorData };
      }
    } catch (error) {
      const errorData =
        error.response?.data ||
        { message: error.message || "Login failed. Please try again." };

      dispatch(setStatus(STATUSES.ERROR));
      dispatch(setError(errorData));

      return { success: false, error: errorData };
    }
  };
}

// Optional: Add a thunk to clear pending email after OTP verification
export function clearPendingEmail() {
  return (dispatch) => {
    dispatch(setPendingEmail(null));
    localStorage.removeItem("pendingEmail");
  };
}