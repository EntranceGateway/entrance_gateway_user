const API_BASE = "http://185.177.116.173:8080/api/v1";

export const fetchBlogs = async () => {
  const res = await fetch(`${API_BASE}/blogs`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
};
