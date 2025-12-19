import api from "./index";

// --------------------------------------
// Create Course (ADMIN)
// --------------------------------------
export const createCourse = async (data) => {
  const res = await api.post("/api/v1/courses", data);
  return res.data;
};

// --------------------------------------
// Get All Courses (PUBLIC)
// --------------------------------------
export const getCourses = async (params = {}) => {
  const res = await api.get("/api/v1/courses", { params });
  return res.data?.data?.content || [];
};

// --------------------------------------
// Get Single Course (PUBLIC)
// --------------------------------------
export const getSingleCourse = async (id) => {
  const res = await api.get(`/api/v1/courses/${id}`);
  return res.data?.data || null;
};

// --------------------------------------
// Update Course (ADMIN)
// --------------------------------------
export const updateCourse = async (id, data) => {
  const res = await api.put(`/api/v1/courses/${id}`, data);
  return res.data;
};

// --------------------------------------
// Delete Course (ADMIN)
// --------------------------------------
export const deleteCourse = async (id) => {
  const res = await api.delete(`/api/v1/courses/${id}`);
  return res.data;
};
