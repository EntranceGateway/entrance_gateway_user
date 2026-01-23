export default function OldQuestionsHeader({ totalResults }) {
  return (
    <div className="mb-6 md:mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-brand-navy font-roboto mb-2">
        Old Questions Archive Directory
      </h1>
      <p className="text-gray-600 text-sm md:text-base">
        Access and download past entrance exam question papers for major IT courses in Nepal.
      </p>
      {totalResults > 0 && (
        <div className="mt-3 text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{totalResults}</span> question{totalResults !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
