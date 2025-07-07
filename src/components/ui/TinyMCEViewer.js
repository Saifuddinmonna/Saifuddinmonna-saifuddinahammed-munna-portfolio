import React, { useState } from "react";
import "./TinyMCEViewer.css";

/**
 * TinyMCEViewer - A simple HTML content viewer for displaying rich text content
 * @param {string} content - The HTML content to display
 * @param {string} className - Additional CSS classes
 * @param {boolean} debug - Show debug information (optional)
 */
const TinyMCEViewer = ({ content = "", className = "", debug = false, ...props }) => {
  const [showDebug, setShowDebug] = useState(debug);

  // Process content to ensure it's properly formatted HTML
  const processContent = rawContent => {
    if (!rawContent) return "";

    let processedContent = rawContent;

    // If content doesn't have HTML tags, wrap it in paragraphs
    if (!/<[^>]*>/.test(rawContent)) {
      // Split by newlines and wrap each line in a paragraph
      processedContent = rawContent
        .split("\n")
        .filter(line => line.trim())
        .map(line => `<p>${line}</p>`)
        .join("");
    }

    // Ensure content has proper HTML structure
    if (!processedContent.includes("<body>") && !processedContent.includes("<html>")) {
      processedContent = `<div class="tinymce-content">${processedContent}</div>`;
    }

    return processedContent;
  };

  const processedContent = processContent(content);

  return (
    <div className={`tinymce-viewer-container ${className}`}>
      {/* Debug Panel */}
      {showDebug && (
        <div className="debug-panel bg-gray-100 p-4 mb-4 border rounded">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-700">Debug Information</h3>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Raw Content:</h4>
              <pre className="bg-white p-2 rounded border text-xs overflow-auto max-h-32">
                {content || "(empty)"}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Processed Content:</h4>
              <pre className="bg-white p-2 rounded border text-xs overflow-auto max-h-32">
                {processedContent || "(empty)"}
              </pre>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            <p>Content length: {content?.length || 0} characters</p>
            <p>Has HTML tags: {/<[^>]*>/.test(content || "") ? "Yes" : "No"}</p>
            <p>Content type: {typeof content}</p>
          </div>
        </div>
      )}

      {/* Main Content Viewer */}
      <div
        className="tinymce-viewer"
        dangerouslySetInnerHTML={{ __html: processedContent }}
        {...props}
      />

      {/* Debug Toggle Button */}
      {!showDebug && (
        <button
          onClick={() => setShowDebug(true)}
          className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full text-xs opacity-50 hover:opacity-100"
          title="Show Debug Info"
        >
          🐛
        </button>
      )}
    </div>
  );
};

export default TinyMCEViewer;
