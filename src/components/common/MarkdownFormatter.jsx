import React from "react";

const MarkdownFormatter = ({ text, className = "" }) => {
  const formatText = (input) => {
    if (!input?.trim()) return "";

    const lines = input.split(/\n/);
    let html = "";
    let inList = false;

    // Helper to convert **bold** → <strong>
    const formatBold = (str) => {
      return str.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    };

    lines.forEach((rawLine) => {
      const line = rawLine.trim();

      if (!line) {
        // skip empty lines (you can decide to add <br> if needed)
        return;
      }

      // ## Sub heading
      if (line.startsWith("##")) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        const content = line.replace(/^##\s*/, "").trim();
        html += `<p class="font-bold text-[12px] mt-3 leading-relaxed">${formatBold(
          content
        )}</p>`;
      }
      // # Main heading
      else if (line.startsWith("#")) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        const content = line.replace(/^#\s*/, "").trim();
        html += `<p class="font-bold text-[16px] mt-4 leading-tight">${formatBold(
          content
        )}</p>`;
      }
      // Bullet point
      else if (line.startsWith("-")) {
        if (!inList) {
          html += `<ul class="list-disc ml-6 space-y-1 mt-1">`;
          inList = true;
        }
        const content = line.replace(/^\s*-\s*/, "").trim();
        html += `<li class="text-slate-700">${formatBold(content)}</li>`;
      }
      // Normal paragraph
      else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<p class="text-slate-700 leading-relaxed mb-3">${formatBold(line)}</p>`;
      }
    });

    if (inList) {
      html += "</ul>";
    }

    return html;
  };

  const htmlContent = formatText(text);

  return (
    <div
      className={`prose prose-slate max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent || "<p>No content</p>" }}
    />
  );
};

export default MarkdownFormatter;