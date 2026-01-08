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

