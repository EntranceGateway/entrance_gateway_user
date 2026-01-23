// notesService.js
import api from "./index"; // your configured axios instance

/**
 * Get all notes with pagination
 * Endpoint: GET /api/v1/notes
 * Authentication: Not Required (Public)
 */
export const getAllNotes = async (page = 0, size = 20) => {
  try {
    const response = await api.get("/notes", {
      params: {
        page,
        size,
      },
    });

    const data = response.data?.data || {};
    
    return {
      content: data.content || [],
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      pageNumber: data.pageNumber || 0,
      pageSize: data.pageSize || size,
      isLast: data.isLast || false,
    };
  } catch (err) {
    const message = err.response?.data?.message || err.message || "Failed to fetch notes";
    throw new Error(message);
  }
};

/**
 * Get notes by filters (server-side filtering)
 * Endpoint: GET /api/v1/notes/filter
 * Authentication: Not Required (Public)
 */
export const getNotesByFilters = async ({ 
  courseName = "",
  semester = "",
  affiliation = "",
  syllabusTitle = "",
  page = 0,
  size = 10,
  sortBy = "noteName",
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
    if (courseName) params.courseName = courseName;
    if (semester) params.semester = semester;
    if (affiliation) params.affiliation = affiliation;
    if (syllabusTitle) params.syllabusTitle = syllabusTitle;

    const response = await api.get("/notes/filter", { params });
    return response.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || "Failed to fetch notes";
    throw new Error(message);
  }
};

// --- Get notes by course and semester ---
export const getNotesByCourse = async (courseName, semester, token) => {
  if (!token) throw new Error("Authentication token is missing");

  try {
    const response = await api.get(
      `/notes/getNotesBy/${courseName}/${semester}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // { data: [...] } expected from backend
  } catch (err) {
    // More robust error handling
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Failed to fetch notes";
    throw new Error(message);
  }
};

/**
 * Get a single note by ID
 * Endpoint: GET /api/v1/notes/{id}
 * Authentication: Not Required (Public)
 */
export const getNoteById = async (id) => {
  if (!id) throw new Error("Note ID is missing");

  try {
    const response = await api.get(`/notes/${id}`);
    return response.data; // { message, data }
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch note";
    throw new Error(message);
  }
};

/**
 * Fetch note details (alias for getNoteById)
 * Endpoint: GET /api/v1/notes/{id}
 * Authentication: Not Required (Public)
 */
export const fetchNoteDetails = async (id) => {
  return getNoteById(id);
};

export const fetchRelatedNotes = async (id, token) => {
  if (!token) throw new Error("Authentication token is missing");
  if (!id) throw new Error("Note ID is missing");

  try {
    const res = await api.get(`/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Failed to fetch note";
    throw new Error(message);
  }
};

// --- Fetch PDF blob ---
export const fetchPdfBlob = async (url="", token) => {
  if (!token) throw new Error("Authentication token is missing");
  if (!url) throw new Error("URL is missing");

  try {
    const res = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
      responseType: "blob",
      withCredentials: true,
    });

    if (res.status !== 200) {
      throw new Error(`Unexpected response status: ${res.status}`);
    }

    const contentType = res.headers["content-type"];
    if (!contentType || !contentType.includes("application/pdf")) {
      throw new Error("Invalid response: not a PDF file");
    }

    return res.data; // Blob object
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Failed to fetch PDF";
    throw new Error(message);
  }
};

// src/data/mockNotes.js
export const notes = [
  {
    id: "1",
    title: "C Programming Notes",
    name: "BCA",
    semester: 1,
    affiliation: "TRIBHUVAN_UNIVERSITY",
  },
  {
    id: "2",
    title: "Discrete Mathematics",
    name: "BCA",
    semester: 1,
    affiliation: "TRIBHUVAN_UNIVERSITY",
  },
  {
    id: "3",
    title: "OOP in Java",
    name: "BCA",
    semester: 2,
    affiliation: "KATHMANDU_UNIVERSITY",
  },
];
