import api from "./index";

// ===============================
// FORGOT PASSWORD - Request OTP
// ===============================
export const requestPasswordReset = async (email) => {
  if (!email) throw new Error("Email is required");
  
  const response = await api.post("/user/forgot-password", { email });
  return response.data;
};

// ===============================
// RESET PASSWORD - With OTP
// ===============================
export const resetPassword = async ({ email, otp, newPassword, confirmNewPassword }) => {
  if (!email || !otp || !newPassword) {
    throw new Error("Email, OTP, and new password are required");
  }

  const response = await api.post("/user/reset-password", {
    email,
    otp,
    newPassword,
    confirmNewPassword,
  });
  return response.data;
};

// ===============================
// CHANGE PASSWORD - Authenticated
// ===============================
export const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("All password fields are required");
  }

  const response = await api.post("/user/change-password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};
