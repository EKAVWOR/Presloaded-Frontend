import API from "./api";

// ============================================================
// Dashboard
// ============================================================
export const getDashboardStats = () => API.get("/admin/stats");

// ============================================================
// Users
// ============================================================
export const getAllUsers = (params) => API.get("/admin/users", { params });
export const getUserById = (id) => API.get(`/admin/users/${id}`);
export const updateUserRole = (id, role) =>
  API.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

// ============================================================
// Courses (admin)
// ============================================================
export const getAllCoursesAdmin = () => API.get("/courses/admin/all");
export const createCourse = (data) => API.post("/courses", data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// ✅ Thumbnail still uses multipart (small file)
export const uploadThumbnail = (formData) =>
  API.post("/courses/upload-thumbnail", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ============================================================
// Orders (admin)
// ============================================================
export const getAllOrdersAdmin = (params) =>
  API.get("/orders/admin/all", { params });

// ============================================================
// Messages
// ============================================================
export const getMessages = (params) => API.get("/contact", { params });
export const markMessageRead = (id) => API.put(`/contact/${id}/read`);
export const deleteMessage = (id) => API.delete(`/contact/${id}`);

// ============================================================
// Newsletter
// ============================================================
export const getSubscribers = () => API.get("/newsletter");

// ============================================================
// Curriculum
// ============================================================
export const getCurriculum = (courseId) =>
  API.get(`/courses/${courseId}/curriculum`);

// ===== Sections =====
export const addSection = (courseId, data) =>
  API.post(`/courses/${courseId}/sections`, data);

export const updateSection = (courseId, sectionId, data) =>
  API.put(`/courses/${courseId}/sections/${sectionId}`, data);

export const deleteSection = (courseId, sectionId) =>
  API.delete(`/courses/${courseId}/sections/${sectionId}`);

// ===== Lessons =====
export const addLesson = (courseId, sectionId, data) =>
  API.post(`/courses/${courseId}/sections/${sectionId}/lessons`, data);

export const updateLesson = (courseId, sectionId, lessonId, data) =>
  API.put(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
    data
  );

export const deleteLesson = (courseId, sectionId, lessonId) =>
  API.delete(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`
  );

// ============================================================
// ✅ UPDATED — Save video URL (YouTube, Cloudinary, etc.)
// No more file upload — just sends video metadata as JSON
// ============================================================
export const uploadLessonVideo = (courseId, sectionId, lessonId, videoData) =>
  API.post(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/video`,
    videoData
    // videoData format:
    // {
    //   videoUrl: "https://youtube.com/watch?v=...",
    //   videoType: "youtube",  // or "cloudinary"
    //   videoPublicId: "abc123",
    //   videoDuration: 0,
    //   thumbnailUrl: "https://..."
    // }
  );