import axios from "axios";
import { DEFAULT_PAGE_SIZE, uiToServerPage } from "../constants/pagination";

// Colleges API uses a different base URL
import api from "./index";

// Attach token automatically
collegesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get paginated list of colleges
 * @param {Object} params - Query parameters
 * @param {number} params.page - UI page number (1-indexed)
 * @param {number} params.size - Page size
 * @returns {Promise<{items: Array, page: Object}>}
 */
export const getColleges = async ({ page = 1, size = DEFAULT_PAGE_SIZE } = {}) => {
  const res = await api.get("/colleges", {
    params: {
      page: uiToServerPage(page),
      size,
    },
  });

  const data = res.data?.data || {};
  return {
    items: data.content || [],
    page: data.page || {},
  };
};

/**
 * Search colleges by name
 * @param {Object} params - Query parameters
 * @param {string} params.name - Search query
 * @param {number} params.page - UI page number (1-indexed)
 * @param {number} params.size - Page size
 * @returns {Promise<{items: Array, page: Object}>}
 */
export const searchColleges = async ({ name, page = 1, size = DEFAULT_PAGE_SIZE }) => {
  const res = await api.get("/colleges/search", {
    params: {
      name,
      page: uiToServerPage(page),
      size,
    },
  });

  const data = res.data?.data || {};
  return {
    items: data.content || [],
    page: data.page || {},
  };
};

/**
 * Get single college by ID
 * @param {string|number} id - College ID
 * @returns {Promise<Object|null>}
 */
export const getCollegeById = async (id) => {
  if (!id) throw new Error("College ID is required");
  const res = await api.get(`/colleges/${id}`);
  return res.data?.data || null;
};
