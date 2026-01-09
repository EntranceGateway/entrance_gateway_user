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
// Get All Courses Sorted (PUBLIC)
// --------------------------------------
export const getCoursesSorted = async (sort = "desc") => {
  const res = await api.get("/courses", { params: { sort } });
  const data = res.data?.data || {};
  return data.content || [];
};

// --------------------------------------
// Get Single Course (PUBLIC)
// --------------------------------------
export const getSingleCourse = async (id) => {
  const res = await api.get(`/courses/${id}`);
  return res.data?.data || null;
};

// --------------------------------------
// Get Course Full Syllabus (PUBLIC)
// --------------------------------------
export const getCourseSyllabus = async (id) => {
  const res = await api.get(`/courses/full-syllabus/${id}`);
  return res.data?.data?.[0] || null;
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
