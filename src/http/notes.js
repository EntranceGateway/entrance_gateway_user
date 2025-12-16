// notesService.js
import axios from "axios";
import api from "./index"; // your configured axios instance

// --- Get notes by course and semester ---
export const getNotesByCourse = async (courseName, semester, token) => {
  if (!token) throw new Error("Authentication token is missing");

  try {
    const response = await api.get(
      `/api/v1/notes/getNotesBy/${courseName}/${semester}`,
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
    const res = await api.get(`/api/v1/notes/${id}`, {
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
    const res = await api.get(`/api/v1/notes/${id}`, {
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
    const res = await api.get(`/api/v1/notes/${id}`, {
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
