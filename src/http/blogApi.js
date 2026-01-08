import api from "./index";
import { DEFAULT_PAGE_SIZE } from "../constants/pagination";

export const fetchBlogs = async (params = {}) => {
  try {
    const res = await api.get("/blogs", {
      params: {
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortBy: "createdDate",
        sortDir: "desc",
        ...params,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
};
