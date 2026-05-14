// src/services/enrollmentService.js
import API from "./api";

// ============================================================
// ENROLLMENT
// ============================================================
export const enrollInCourse = (courseId) =>
  API.post(`/enrollments/${courseId}`);

export const getMyEnrollments = () =>
  API.get("/enrollments/my-courses");

export const getEnrollment = (courseId) =>
  API.get(`/enrollments/${courseId}`);

// ============================================================
// PROGRESS
// ============================================================
export const updateProgress = (courseId, lessonId, data) =>
  API.post(`/enrollments/${courseId}/progress/${lessonId}`, data);

export const getProgress = (courseId) =>
  API.get(`/enrollments/${courseId}/progress`);

// ============================================================
// CERTIFICATE
// ============================================================
export const getCertificate = (courseId) =>
  API.get(`/enrollments/${courseId}/certificate`);

export const verifyCertificate = (certificateNumber) =>
  API.get(`/enrollments/verify-certificate/${certificateNumber}`);

// ✅ NEW: Direct download of certificate PDF (server-generated, optional)
export const downloadCertificatePDF = (certificateNumber) =>
  API.get(`/enrollments/verify-certificate/${certificateNumber}/download`, {
    responseType: "blob",
  });

// ============================================================
// COMMENTS
// ============================================================
export const getLessonComments = (courseId, lessonId) =>
  API.get(`/enrollments/${courseId}/lessons/${lessonId}/comments`);

export const addLessonComment = (courseId, lessonId, data) =>
  API.post(`/enrollments/${courseId}/lessons/${lessonId}/comments`, data);

export const replyToComment = (courseId, lessonId, commentId, data) =>
  API.post(
    `/enrollments/${courseId}/lessons/${lessonId}/comments/${commentId}/replies`,
    data
  );

export const deleteComment = (courseId, lessonId, commentId) =>
  API.delete(
    `/enrollments/${courseId}/lessons/${lessonId}/comments/${commentId}`
  );

// ============================================================
// HELPERS
// ============================================================

// ✅ Build verification URL for sharing
export const getCertificateVerificationURL = (certificateNumber) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/certificate/${certificateNumber}`;
};