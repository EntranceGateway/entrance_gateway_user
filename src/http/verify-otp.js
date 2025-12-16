// otpService.js
import api from "./index";

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/api/register/verify-otp", {
      email,
      otp,
    });
    return response.data; // Only return the data from server
  } catch (err) {
    // Throws backend error if available, else full error
    throw err.response?.data || err;
  }
};

export const reSend = async (email) => {
  try {
    const response = await api.post("/api/register/verify-otp", {
      email
    });
    return response.data; // Only return the data from server
  } catch (err) {
    // Throws backend error if available, else full error
    throw err.response?.data || err;
  }
};