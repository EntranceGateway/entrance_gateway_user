import PdfViewer from "../../common/pdf/PdfViewer";
import { fetchResourcePreview } from "../../../http/resources";

export default function SyllabusPdfViewer({ syllabus }) {
  // Wrapper function for PdfViewer to fetch PDF blob using resources API
  // Note: PdfViewer passes (url, token) but we ignore them and use syllabus.syllabusFile
  const fetchPdfBlob = async (url, token) => {
    const { blob } = await fetchResourcePreview(syllabus.syllabusFile);
    return blob;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-[85vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] overflow-hidden">
      {/* PDF Toolbar */}
      <div className="flex items-center px-3 md:px-4 py-2 md:py-3 bg-white border-b border-gray-200 z-10">
        <h3 className="text-xs md:text-sm font-semibold text-gray-700">
          Syllabus Document
        </h3>
      </div>

      {/* PDF Content */}
      <div className="flex-1 bg-gray-100 overflow-hidden">
        <PdfViewer
          noteId={syllabus.syllabusFile}
          token={null}
          fetchPdfBlob={fetchPdfBlob}
          suburl=""
          urlSuffix=""
        />
      </div>
    </div>
  );
}
