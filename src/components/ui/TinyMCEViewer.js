import React, { useState, useRef, useEffect } from "react";
import "./TinyMCEViewer.css";

/**
 * TinyMCEViewer - A simple HTML content viewer for displaying rich text content
 * @param {string} content - The HTML content to display
 * @param {string} className - Additional CSS classes
 * @param {boolean} debug - Show debug information (optional)
 */
const TinyMCEViewer = ({ content = "", className = "", debug = false, ...props }) => {
  const [showDebug, setShowDebug] = useState(debug);
  const contentRef = useRef(null);

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

  // Enhanced anchor scroll-to logic
  useEffect(() => {
    const scrollToHash = () => {
      if (!window.location.hash) return;

      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      // Wait a bit for content to be fully rendered
      setTimeout(() => {
        if (!contentRef.current) return;

        // Try multiple selectors to find the target element
        const selectors = [
          `#${CSS.escape(hash)}`,
          `[id="${CSS.escape(hash)}"]`,
          `[name="${CSS.escape(hash)}"]`,
          `[data-id="${CSS.escape(hash)}"]`,
          `[data-anchor="${CSS.escape(hash)}"]`,
          // For table of contents links, try common patterns
          `[id*="${hash}"]`,
          `[name*="${hash}"]`,
          // Look for headings that might match
          `h1[id*="${hash}"], h2[id*="${hash}"], h3[id*="${hash}"], h4[id*="${hash}"], h5[id*="${hash}"], h6[id*="${hash}"]`,
          // Look for any element containing the hash in its id
          `[id*="${hash.replace(/[^a-zA-Z0-9]/g, "")}"]`,
        ];

        let targetElement = null;

        for (const selector of selectors) {
          try {
            const el = contentRef.current.querySelector(selector);
            if (el) {
              targetElement = el;
              break;
            }
          } catch (e) {
            // Invalid selector, continue to next
            continue;
          }
        }

        // If still not found, try to find by text content (for table of contents)
        if (!targetElement) {
          const allElements = contentRef.current.querySelectorAll("*");
          for (const el of allElements) {
            if (
              el.textContent &&
              el.textContent.trim() &&
              (el.textContent.includes(hash) ||
                el.getAttribute("id")?.includes(hash) ||
                el.getAttribute("name")?.includes(hash))
            ) {
              targetElement = el;
              break;
            }
          }
        }

        if (targetElement) {
          // Scroll to the element
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Highlight the element temporarily
          const originalBackground = targetElement.style.backgroundColor;
          targetElement.style.backgroundColor = "#ffffcc";
          targetElement.style.transition = "background-color 0.3s ease";

          setTimeout(() => {
            targetElement.style.backgroundColor = originalBackground;
            targetElement.style.transition = "";
          }, 2000);

          if (debug) {
            console.log("Scrolled to element:", targetElement);
          }
        } else {
          if (debug) {
            console.log("Could not find element for hash:", hash);
            console.log(
              "Available elements with IDs:",
              Array.from(contentRef.current.querySelectorAll("[id]")).map(el => el.id)
            );
          }
        }
      }, 100); // Small delay to ensure content is rendered
    };

    // Scroll on mount/content change
    scrollToHash();

    // Listen to hashchange event
    window.addEventListener("hashchange", scrollToHash);

    // Cleanup
    return () => {
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [content, debug]);

  return (
    <div className={`tinymce-viewer-root ${className}`}>
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
        ref={contentRef}
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
