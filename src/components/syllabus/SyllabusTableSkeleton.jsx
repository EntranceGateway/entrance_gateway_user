export default function SyllabusTableSkeleton() {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <tr key={i} className="animate-pulse even:bg-gray-50">
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="h-9 bg-gray-200 rounded w-32 ml-auto"></div>
          </td>
        </tr>
      ))}
    </>
  );
}
