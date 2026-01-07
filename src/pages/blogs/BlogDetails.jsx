// src/components/blogs/BlogDetails.jsx
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Mail,
  Phone,
  ArrowLeft,
  Share2,
  Clock,
  User
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const BlogDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const blog = state?.blog;

  if (!blog) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Post not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex items-center px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to feed
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">

        {/* --- Back Button & Actions --- */}
        <div className="max-w-5xl mx-auto px-4 pt-8 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Share2 className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* --- Header Section --- */}
        <header className="max-w-4xl mx-auto px-4 pt-10 pb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Author + Meta */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-orange-500" />
              <span className="font-medium">Entrance Gateway</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-orange-500" />
              {new Date(blog.createdDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              5 min read
            </div>
          </div>
        </header>

        {/* --- Featured Image --- */}
        {blog.imageName && (
          <div className="max-w-4xl mx-auto px-4 mb-12">
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={`https://api.entrancegateway.com/api/v1/blogs/getBlogFile/${blog.blogId}`}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
            </div>
          </div>
        )}

        {/* --- Article Body --- */}
        <article className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {blog.content.split("\n").map(
              (paragraph, index) =>
                paragraph && (
                  <p
                    key={index}
                    className="mb-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify"
                  >
                    {paragraph}
                  </p>
                )
            )}
          </div>

          {/* --- Contact / Author Card --- */}
          {(blog.contactEmail || blog.contactPhone) && (
            <div className="mt-16 border-t border-gray-100 dark:border-gray-800 pt-10">
              <div className="bg-linear-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border border-orange-100 dark:border-gray-700 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  About the Author
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This article is published by <b>Entrance Gateway</b>, your trusted
                  platform for entrance exam preparation and admission insights.
                </p>
                <div className="space-y-3">
                  {blog.contactEmail && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mr-3 shadow-sm">
                        <Mail className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="font-medium">{blog.contactEmail}</span>
                    </div>
                  )}
                  {blog.contactPhone && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mr-3 shadow-sm">
                        <Phone className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="font-medium">{blog.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- Author Attribution Footer --- */}
          <div className="mt-12 text-left text-lg text-gray-500 dark:text-gray-400">
            <span>Author by : <b>Entrance Gateway</b></span>
          </div>
        </article>
      </div>
    </DashboardLayout>
  );
};

export default BlogDetails;
