import { Link } from "react-router-dom";
import { User, Clock } from "lucide-react";

const BlogCard = ({ blog }) => {
  return (
    <Link
      to={`/blogs/${blog.blogId}`}
      state={{ blog }}
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
    >
      <img
        src={`http://185.177.116.173:8080/uploads/${blog.imageName}`}
        alt={blog.title}
        className="h-48 w-full object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x250";
        }}
      />

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">
          {blog.title}
        </h3>

        {/* Author + Read Time */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1 text-orange-500" />
            <span>Entrance Gateway</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-orange-500" />
            <span>8 min read</span>
          </div>
        </div>

        <p className="mt-3 text-gray-600 line-clamp-3">
          {blog.content}
        </p>

        <span className="block mt-4 text-sm text-orange-500 font-semibold">
          Read more →
        </span>
      </div>
    </Link>
  );
};

export default BlogCard;
