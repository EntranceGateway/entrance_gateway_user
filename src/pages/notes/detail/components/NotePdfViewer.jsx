import PdfViewer from "../../../../components/common/pdf/PdfViewer";
import { fetchResourcePreview } from "../../../../http/resources";

export default function NotePdfViewer({ fileName }) {
  // Wrapper function for PdfViewer to fetch PDF blob using resources API
  // Note: PdfViewer passes (url, token) but we ignore them and use fileName
  const fetchPdfBlob = async (url, token) => {
    const { blob } = await fetchResourcePreview(fileName);
    return blob;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-[800px] mb-8">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center z-10 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700">
          Note Document
        </h3>
      </div>

      {/* PDF Content */}
      <div className="flex-grow bg-gray-500 overflow-auto relative flex justify-center p-8 custom-scrollbar">
        <PdfViewer
          noteId={fileName}
          token={null}
          fetchPdfBlob={fetchPdfBlob}
          suburl=""
          urlSuffix=""
        />
      </div>
    </div>
  );
}
