export default function OldQuestionDescription({ description }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-brand-blue">info</span>
        <h3 className="text-lg font-bold text-brand-navy font-roboto">
          Description
        </h3>
      </div>
      <div className="prose prose-sm max-w-none text-gray-600">
        <p>{description || "No description available for this question paper."}</p>
      </div>
    </div>
  );
}
