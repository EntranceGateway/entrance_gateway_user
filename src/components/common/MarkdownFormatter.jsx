import React from 'react';

/**
 * Custom lightweight Markdown formatter component
 * Supports:
 *   # Heading          → 16px bold
 *   ## Subheading      → 12px bold
 *   - Bullet points
 *   **bold text**      anywhere in content
 *
 * Features:
 * - Builds real JSX elements (no dangerouslySetInnerHTML)
 * - Proper list grouping
 * - Clean spacing & typography
 * - Safe & maintainable
 */
const MarkdownFormatter = ({ text = '', className = '' }) => {
  if (!text.trim()) {
    return (
      <p className="text-slate-400 italic py-3">
        No content available
      </p>
    );
  }

  const lines = text.split(/\r?\n/);
  const elements = [];
  let currentListItems = [];

  // Helper: convert **text** → <strong>text</strong>
  const renderWithBold = (content) => {
    if (!content) return content;

    const parts = content.split(/(\*\*[^*]*\*\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const flushList = () => {
    if (currentListItems.length === 0) return;

    elements.push(
      <ul
        key={`list-${elements.length}`}
        className="list-disc ml-6 space-y-1.5 mt-2 mb-4 text-slate-700"
      >
        {currentListItems}
      </ul>
    );

    currentListItems = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    // Skip completely empty lines
    if (!line) {
      flushList(); // treat blank line as list separator
      return;
    }

    // # Heading
    if (line.startsWith('# ')) {
      flushList();
      const content = line.slice(2).trim();
      elements.push(
        <h2
          key={`h-${index}`}
          className="font-bold text-[16px] text-slate-900 mt-6 mb-2.5 leading-tight"
        >
          {renderWithBold(content)}
        </h2>
      );
    }

    // ## Subheading
    else if (line.startsWith('## ')) {
      flushList();
      const content = line.slice(3).trim();
      elements.push(
        <h3
          key={`sh-${index}`}
          className="font-bold text-[12px] text-slate-800 mt-5 mb-2 uppercase tracking-wide"
        >
          {renderWithBold(content)}
        </h3>
      );
    }

    // - Bullet
    else if (line.startsWith('- ')) {
      const content = line.slice(2).trim();
      currentListItems.push(
        <li
          key={`li-${index}`}
          className="leading-relaxed"
        >
          {renderWithBold(content)}
        </li>
      );
    }

    // Normal paragraph
    else {
      flushList();
      elements.push(
        <p
          key={`p-${index}`}
          className="text-slate-700 leading-relaxed mb-3"
        >
          {renderWithBold(line)}
        </p>
      );
    }
  });

  // Final flush in case it ends with a list
  flushList();

  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      {elements.length > 0 ? (
        elements
      ) : (
        <p className="text-slate-400 italic">No readable content</p>
      )}
    </div>
  );
};

export default MarkdownFormatter;