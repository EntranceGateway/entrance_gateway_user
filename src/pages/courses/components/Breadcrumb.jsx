import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ courseName }) {
  return (
    <nav className="flex items-center gap-2 mb-6 text-sm text-gray-500">
      <Link to="/" className="hover:text-brand-blue transition-colors">
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link to="/courses" className="hover:text-brand-blue transition-colors">
        Courses
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-brand-navy font-medium">{courseName}</span>
    </nav>
  );
}
