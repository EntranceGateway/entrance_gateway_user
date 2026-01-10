// api/userApi.js
import api from "./index";

export const getUserDetail = async () => {
  try {
    const res = await api.get("/user/me");

    const userData = res.data?.data;

    // Cache user data
    localStorage.setItem(
      "cachedUser",
      JSON.stringify(userData)
    );

    return userData;
  } catch (error) {
    const status = error.response?.status;
    throw new Error(
      `Failed to fetch user details${status ? `: ${status}` : ""}`
    );
  }
};

// src/api/auth.api.js
export const getUserDetails = async () => {
  const res = await api.get("/user/me");
  return res.data.data;
};

/**
 * Update user profile
 * @param {Object} data - Profile data
 * @param {string} data.fullname - User's full name
 * @param {string} data.email - User's email (required but cannot be changed)
 * @param {string} data.contact - User's phone number
 * @param {string} data.address - User's address
 * @param {string} data.dob - Date of birth (YYYY-MM-DD format)
 * @param {string} data.interested - Field of interest
 * @param {string} data.latestQualification - Latest qualification
 * @param {string} data.password - Password (optional, only if changing)
 * @param {string} data.role - User role
 * @returns {Promise} API response
 */
export const updateUserProfile = async (data) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    throw new Error("User ID not found. Please login again.");
  }
  
  const response = await api.put(`/user/${userId}/update-profile`, data);
  
  // Update cached user data
  if (response.data?.data) {
    localStorage.setItem("cachedUser", JSON.stringify(response.data.data));
  }
  
  return response.data;
};

