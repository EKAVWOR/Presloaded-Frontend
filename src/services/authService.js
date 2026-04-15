import API from "./api";

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const verifyEmail = (token) =>
  API.get(`/auth/verify-email/${token}`);
export const resendVerification = () =>
  API.post("/auth/resend-verification");
export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) =>
  API.post(`/auth/reset-password/${token}`, { password });
export const updateProfile = (data) => API.put("/auth/update-profile", data);
export const changePassword = (data) =>
  API.put("/auth/change-password", data);