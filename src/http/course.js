import api from "./index";

// --------------------------------------
// Create Course (ADMIN)
// --------------------------------------
export const createCourse = async (data) => {
  const res = await api.post("/courses", data);
  return res.data;
};

// --------------------------------------
// Get All Courses (PUBLIC)
// --------------------------------------
export const getCourses = async (params = {}) => {
  const res = await api.get("/courses", { params });
  const data = res.data?.data || {};

  return {
    items: data.content || [],
    page: data.page || {},
  };
};

// --------------------------------------
// Get Single Course (PUBLIC)
// --------------------------------------
export const getSingleCourse = async (id) => {
  const res = await api.get(`/courses/${id}`);
  return res.data?.data || null;
};

// --------------------------------------
// Update Course (ADMIN)
// --------------------------------------
export const updateCourse = async (id, data) => {
  const res = await api.put(`/courses/${id}`, data);
  return res.data;
};

// --------------------------------------
// Delete Course (ADMIN)
// --------------------------------------
export const deleteCourse = async (id) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};
