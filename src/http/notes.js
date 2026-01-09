// notesService.js
import axios from "axios";
import api from "./index"; // your configured axios instance

// --- Get notes by filters (courseName, semester, affiliation) ---
export const getNotesByFilters = async ({ courseNames, semesters, affiliations }) => {
  if (!courseNames?.length || !semesters?.length || !affiliations?.length) {
    return { items: [], total: 0 };
  }

  try {
    const params = new URLSearchParams();
    courseNames.forEach(name => params.append("courseName", name));
    semesters.forEach(sem => params.append("semester", sem));
    affiliations.forEach(aff => params.append("affiliation", aff));

    const response = await api.get("/notes/by-course-semester-affiliation", { params });
    const content = response.data?.data?.content || [];
    
    return {
      items: content,
      total: content.length,
    };
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

// --- Get a single note by ID ---
export const getNoteById = async (id, token) => {
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
export const fetchNoteDetails = async (id, token) => {
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
