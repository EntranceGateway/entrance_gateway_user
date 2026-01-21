import { Info } from 'lucide-react';

export function CollegeAbout({ description }) {
  const defaultDescription = 'This institution is committed to excellence in education, offering modern facilities and a vibrant learning environment. With experienced faculty and state-of-the-art infrastructure, students are prepared to excel in their chosen fields.';

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
        <Info className="w-5 h-5 sm:w-6 sm:h-6" />
        About the College
      </h2>
      <div className="prose max-w-none text-gray-600 text-sm sm:text-base leading-relaxed">
        <p>{description || defaultDescription}</p>
      </div>
    </section>
  );
}
