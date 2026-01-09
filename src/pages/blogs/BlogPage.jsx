import { useEffect, useMemo, useState } from "react";
import { fetchBlogs } from "../../http/blogApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Pagination from "../../components/Pagination/pagination";
import { DEFAULT_PAGE_SIZE } from "../../constants/pagination";
import { 
  BlogCard, 
  PageHeader, 
  LoadingSpinner, 
  ErrorState, 
  ItemGrid 
} from "../../components/common";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadBlogs = () => {
    setLoading(true);
    setError(false);
    fetchBlogs()
      .then((res) => {
        const content = res.data?.content || [];
        setBlogs(content);
        setTotalPages(Math.ceil(content.length / DEFAULT_PAGE_SIZE));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const paginated = useMemo(
    () => blogs.slice((currentPage - 1) * DEFAULT_PAGE_SIZE, currentPage * DEFAULT_PAGE_SIZE),
    [blogs, currentPage]
  );

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Loading blogs..." fullScreen />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState 
          title="Failed to load blogs"
          message="Please try again later."
          onRetry={loadBlogs}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="Blogs & Articles"
            subtitle="Discover insights, tips, and the latest updates from our team."
            className="text-center"
          />

          {blogs.length === 0 ? (
            <ErrorState 
              variant="empty"
              title="No blogs available"
              message="Check back later for new content."
            />
          ) : (
            <>
              <ItemGrid
                items={paginated}
                columns={4}
                keyExtractor={(blog) => blog.blogId}
                renderItem={(blog) => <BlogCard blog={blog} />}
              />

              <Pagination
                page={currentPage}
                totalItems={blogs.length}
                pageSize={DEFAULT_PAGE_SIZE}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isDisabled={loading}
                showPageInfo
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Blogs;