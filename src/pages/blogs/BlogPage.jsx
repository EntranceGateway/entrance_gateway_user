import { useEffect, useState } from "react";
import BlogCard from "../../components/common/Blog/BlogCard";
import { fetchBlogs } from "../../http/blogApi";
import Pagination from "../../components/Pagination/pagination";
import DashboardLayout from "../../components/layout/DashboardLayout";

const PAGE_SIZE = 12;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs()
      .then((res) => {
        const content = res.data?.content || [];
        setBlogs(content);
        setTotalPages(Math.ceil(content.length / PAGE_SIZE));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const paginated = blogs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          <span className="ml-4 text-lg text-gray-600">Loading blogs...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-red-600 text-xl">Failed to load blogs. Please try again later.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Blogs & Articles
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover insights, tips, and the latest updates from our team.
            </p>
          </div>

          {/* Optional: Search or Filter Bar (can be expanded later) */}
          {/* <div className="mb-10 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          {/* Responsive Blog Grid */}
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400">No blogs available yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {paginated.map((blog) => (
                  <div
                    key={blog.blogId}
                    className="transform transition duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={loading}
                showPageInfo={true}
              />
            </>
          )}

          {/* Optional: Pagination (if API supports it) */}
          {/* <div className="mt-12 flex justify-center">
            <nav className="flex space-x-2">
              <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300">Previous</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">1</button>
              <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300">Next</button>
            </nav>
          </div> */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Blogs;