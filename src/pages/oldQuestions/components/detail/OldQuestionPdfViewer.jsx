import PdfViewer from "../../../../components/common/pdf/PdfViewer";
import { fetchResourcePreview } from "../../../../http/resources";

export default function OldQuestionPdfViewer({ pdfFilePath }) {
  // Wrapper function for PdfViewer to fetch PDF blob using resources API
  // Note: PdfViewer passes (url, token) but we ignore them and use pdfFilePath
  const fetchPdfBlob = async (url, token) => {
    const { blob } = await fetchResourcePreview(pdfFilePath);
    return blob;
  };

  if (!pdfFilePath) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[850px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              description
            </span>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No PDF Available
            </h3>
            <p className="text-gray-500">This question paper doesn't have a PDF file.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[850px] relative">
      <PdfViewer
        noteId={pdfFilePath}
        token={null}
        fetchPdfBlob={fetchPdfBlob}
        suburl=""
        urlSuffix=""
      />
    </div>
  );
}
