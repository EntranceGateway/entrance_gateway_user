import api from "./index"; // Axios instance

// ===============================
// CREATE SYLLABUS (JSON + File)
// ===============================
export const addSyllabus = async (formData, token) => {
  try {
    return await api.post("/syllabus", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ Don't manually set Content-Type for FormData
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET ALL SYLLABUS WITH PAGINATION
// ===============================
export const getSyllabus = async (page = 0, size = 10, sortBy = "syllabusTitle", sortDir = "asc") => {
  try {
    const response = await api.get("/syllabus", {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SINGLE SYLLABUS
// ===============================
export const getSyllabusById = async (id, token) => {
  try {
    return await api.get(`/syllabus/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SYLLABUS FILE
// ===============================

// Get syllabus file (PDF)
export const getSyllabusFile = async (syllabusId, token) => {
  try {
    return await api.get(`/syllabus/getSyllabusFile/${syllabusId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      responseType: "blob", // PDF blob
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// UPDATE SYLLABUS DETAILS (JSON or FormData)
// ===============================
export const updateSyllabus = async (id, data, token) => {
  try {
    // If data is FormData → PUT /file endpoint
    if (data instanceof FormData) {
      return await api.put(`/syllabus/${id}/file`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Otherwise → JSON PUT
    return await api.put(`/syllabus/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// DELETE SYLLABUS
// ===============================
export const deleteSyllabus = async (id, token) => {
  try {
    return await api.delete(`/syllabus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SYLLABUS BY FILTERS
// ===============================
export const getSyllabusByFilters = async ({
  affiliation = "",
  courseName = "",
  semester = "",
  page = 0,
  size = 10,
  sortBy = "syllabusTitle",
  sortDir = "asc"
}) => {
  try {
    const params = {
      page,
      size,
      sortBy,
      sortDir
    };

    // Only add filter params if they have values
    if (affiliation) params.affiliation = affiliation;
    if (courseName) params.courseName = courseName;
    if (semester) params.semester = semester;

    const response = await api.get("/syllabus/by-affiliation/by-course/semester", { params });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
