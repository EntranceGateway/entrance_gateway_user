import React from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import ViewerButton from "./ViewerButton";

export default function PdfToolbar({
  currentPage,
  numPages,
  onPrev,
  onNext,
  isFullscreen,
  onToggleFullscreen,
}) {
  return (
    <div className="flex items-center justify-center gap-2 p-3 border-b bg-white">
      <ViewerButton icon={ChevronLeft} onClick={onPrev} disabled={currentPage <= 1} />

      <span className="mx-2 text-sm font-medium">
        {currentPage} / {numPages}
      </span>

      <ViewerButton icon={ChevronRight} onClick={onNext} disabled={currentPage >= numPages} />

      <ViewerButton
        icon={isFullscreen ? Minimize2 : Maximize2}
        onClick={onToggleFullscreen}
      />
    </div>
  );
}
