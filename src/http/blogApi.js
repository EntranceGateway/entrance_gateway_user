import api from "./index";

export const fetchBlogs = async () => {
  try {
    const res = await api.get("/api/v1/blogs?page=0&size=10&sortBy=createdDate&sortDir=desc");
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch blogs"
    );
  }
};
