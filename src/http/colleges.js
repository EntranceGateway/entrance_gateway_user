import { DEFAULT_PAGE_SIZE, uiToServerPage } from "../constants/pagination";
import api from "./index";

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
    totalPages: data.page?.totalPages || 1,
    totalElements: data.page?.totalElements || 0,
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
    totalPages: data.page?.totalPages || 1,
    totalElements: data.page?.totalElements || 0,
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

