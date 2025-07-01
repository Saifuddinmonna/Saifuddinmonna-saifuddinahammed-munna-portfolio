import React, { useRef } from "react";
import ReactMarkdown from "react-markdown";

/**
 * MarkdownEditor - A reusable Markdown editor and viewer component
 * @param {string} value - The markdown content
 * @param {function} onChange - Callback when content changes
 * @param {boolean} readOnly - If true, only render markdown (no editing)
 * @param {boolean} showFileInput - If true, show a file input for loading .md files
 */
const MarkdownEditor = ({ value = "", onChange, readOnly = false, showFileInput = false }) => {
  const fileInputRef = useRef();

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = evt => {
        if (onChange) onChange(evt.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please select a valid .md file");
    }
  };

  return (
    <div className="markdown-editor-component">
      {showFileInput && (
        <div className="mb-2">
          <input
            type="file"
            accept=".md,text/markdown"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      )}
      {!readOnly && (
        <textarea
          className="w-full min-h-[150px] p-2 border rounded mb-4 font-mono"
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          placeholder="Write your markdown here..."
        />
      )}
      <div className="markdown-preview p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownEditor;
