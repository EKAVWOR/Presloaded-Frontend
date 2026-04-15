import API from "./api";

export const getCourses = (params) => API.get("/courses", { params });
export const getCourseBySlug = (slug) => API.get(`/courses/${slug}`);
export const getFeaturedCourses = () => API.get("/courses?featured=true&limit=6");