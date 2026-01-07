import React, { useEffect, useState } from "react";
import Pagination from "./pagination";

const BlogP = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1); // ✅ 1-based
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async (pageNo) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://api.entrancegateway.com/api/v1/blogs?page=${pageNo - 1}&size=1&sortBy=createdDate&sortDir=desc`
      );

      const result = await response.json();

      setBlogs(result.data.content);
      setTotalPages(result.data.totalPages);
    } catch (error) {
      console.error("Failed to load blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Blogs</h2>

      {loading && (
        <div className="text-center text-gray-500">Loading blogs...</div>
      )}

      {!loading && blogs.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.blogId}
              className="border rounded-xl overflow-hidden bg-white hover:shadow-lg transition"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {blog.createdDate}
                </p>
                <p className="text-gray-700 text-sm mt-3 line-clamp-3">
                  {blog.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && blogs.length === 0 && (
        <div className="text-center text-gray-500">
          No blogs available
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default BlogP;
