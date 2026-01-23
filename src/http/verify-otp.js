// otpService.js
import api from "./index";

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/auth/user/verify-otp", {
      email,
      otp,
    });
    return response.data;
  } catch (err) {
    // Re-throw the full error object for proper error handling
    throw err;
  }
};

export const reSend = async (email) => {
  try {
    const response = await api.post("/auth/user/resend-otp", {
      email
    });
    return response.data;
  } catch (err) {
    // Re-throw the full error object for proper error handling
    throw err;
  }
};