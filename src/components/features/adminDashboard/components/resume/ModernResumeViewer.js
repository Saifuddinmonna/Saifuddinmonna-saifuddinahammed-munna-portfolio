import React, { useState } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaVideo,
  FaDownload,
  FaExpand,
  FaCompress,
  FaTimes,
  FaPrint,
  FaShare,
  FaCopy,
  FaEyeSlash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
} from "react-icons/fa";
import DocxViewer from "../../../../ui/DocxViewer";
import TinyMCEViewer from "../../../../ui/TinyMCEViewer";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ModernResumeViewer = ({ open, onClose, resume }) => {
  const [activeTab, setActiveTab] = useState("text");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfError, setPdfError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = error => {
    console.error("PDF load error:", error);
    setPdfError("Failed to load PDF. It might be corrupted or password protected.");
  };

  const handleDownload = fileType => {
    if (resume[fileType]?.url) {
      const link = document.createElement("a");
      link.href = resume[fileType].url;

      // Get the original filename with proper extension
      let filename = resume[fileType].originalName || resume[fileType].filename;

      // If no original name, create one with proper extension
      if (!filename) {
        const extensions = {
          pdfFile: ".pdf",
          docxFile: ".docx",
          videoFile: ".mp4",
        };
        const extension = extensions[fileType] || "";
        filename = `${resume.name}_${resume.versionName}${extension}`;
      }

      // Ensure proper file extension
      if (!filename.includes(".")) {
        const extensions = {
          pdfFile: ".pdf",
          docxFile: ".docx",
          videoFile: ".mp4",
        };
        filename += extensions[fileType] || "";
      }

      // Clean filename (remove special characters)
      filename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

      link.download = filename;
      link.target = "_blank";

      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      const fileTypeNames = {
        pdfFile: "PDF",
        docxFile: "DOCX",
        videoFile: "Video",
      };

      setDownloadStatus({
        type: "success",
        message: `Downloading ${fileTypeNames[fileType]}: ${filename}`,
        filename: filename,
      });

      // Clear status after 3 seconds
      setTimeout(() => setDownloadStatus(null), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resume.name} - ${resume.versionName}`,
          text: resume.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleCopyContent = () => {
    const textContent = resume.textContent.replace(/<[^>]*>/g, "");
    navigator.clipboard.writeText(textContent);
    alert("Content copied to clipboard!");
  };

  if (!open || !resume) return null;

  const hasPdf = resume.pdfFile?.url;
  const hasDocx = resume.docxFile?.url;
  const hasVideo = resume.videoFile?.url;
  const hasText = resume.textContent && resume.textContent.trim();

  const availableTabs = [
    { id: "text", label: "📝 Text Content", icon: "📝", available: hasText },
    {
      id: "pdf",
      label: "PDF Document",
      icon: <FaFilePdf className="text-red-500" />,
      available: hasPdf,
    },
    {
      id: "docx",
      label: "DOCX Document",
      icon: <FaFileWord className="text-blue-500" />,
      available: hasDocx,
    },
    {
      id: "video",
      label: "Video Resume",
      icon: <FaVideo className="text-purple-500" />,
      available: hasVideo,
    },
  ].filter(tab => tab.available);

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isFullscreen ? "bg-white" : "bg-black bg-opacity-50 flex items-center justify-center"
      }`}
    >
      <div
        className={`${
          isFullscreen ? "w-full h-full" : "w-full h-full max-w-7xl max-h-[95vh]"
        } bg-white shadow-2xl overflow-hidden relative`}
      >
        {/* Download Status Notification */}
        {downloadStatus && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
              downloadStatus.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="text-lg">{downloadStatus.type === "success" ? "✅" : "❌"}</div>
              <div>
                <div className="font-medium">{downloadStatus.message}</div>
                {downloadStatus.filename && (
                  <div className="text-sm opacity-90 truncate">{downloadStatus.filename}</div>
                )}
              </div>
              <button
                onClick={() => setDownloadStatus(null)}
                className="ml-auto text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-yellow-600 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
              <div>
                <h2 className="text-xl font-bold">
                  {resume.name} - {resume.versionName}
                </h2>
                <p className="text-sm opacity-90">{resume.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-yellow-600 rounded-lg transition-colors"
                title="Print"
              >
                <FaPrint />
              </button>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-yellow-600 rounded-lg transition-colors"
                title="Share"
              >
                <FaShare />
              </button>
              <button
                onClick={handleCopyContent}
                className="p-2 hover:bg-yellow-600 rounded-lg transition-colors"
                title="Copy Content"
              >
                <FaCopy />
              </button>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-yellow-600 rounded-lg transition-colors"
                title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
              >
                {showSidebar ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-yellow-600 rounded-lg transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>

          {/* File Info */}
          <div className="mt-2 text-xs opacity-75 flex items-center gap-4">
            <span>Created: {new Date(resume.createdAt).toLocaleDateString()}</span>
            {resume.originalCreationDate && (
              <span>Original: {new Date(resume.originalCreationDate).toLocaleDateString()}</span>
            )}
            <span>Status: {resume.isActive ? "🟢 Active" : "🔴 Inactive"}</span>
            <span>
              Files: {[hasPdf, hasDocx, hasVideo, hasText].filter(Boolean).length} available
            </span>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
              {/* Tab Navigation */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">View Options</h3>
                <div className="space-y-2">
                  {availableTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-yellow-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Downloads */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">Downloads</h3>
                <div className="space-y-2">
                  {hasPdf && (
                    <button
                      onClick={() => handleDownload("pdfFile")}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      title={resume.pdfFile?.originalName || "Download PDF"}
                    >
                      <FaDownload />
                      <div className="flex-1 text-left">
                        <div className="font-medium">Download PDF</div>
                        {resume.pdfFile?.originalName && (
                          <div className="text-xs opacity-75 truncate">
                            {resume.pdfFile.originalName}
                          </div>
                        )}
                      </div>
                    </button>
                  )}
                  {hasDocx && (
                    <button
                      onClick={() => handleDownload("docxFile")}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      title={resume.docxFile?.originalName || "Download DOCX"}
                    >
                      <FaDownload />
                      <div className="flex-1 text-left">
                        <div className="font-medium">Download DOCX</div>
                        {resume.docxFile?.originalName && (
                          <div className="text-xs opacity-75 truncate">
                            {resume.docxFile.originalName}
                          </div>
                        )}
                      </div>
                    </button>
                  )}
                  {hasVideo && (
                    <button
                      onClick={() => handleDownload("videoFile")}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      title={resume.videoFile?.originalName || "Download Video"}
                    >
                      <FaDownload />
                      <div className="flex-1 text-left">
                        <div className="font-medium">Download Video</div>
                        {resume.videoFile?.originalName && (
                          <div className="text-xs opacity-75 truncate">
                            {resume.videoFile.originalName}
                          </div>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Resume Details */}
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-gray-700 mb-3">Resume Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">For Position:</span>
                    <p className="text-gray-800">{resume.forWhichPost}</p>
                  </div>
                  {resume.suitableFor?.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600">Suitable For:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {resume.suitableFor.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {resume.tags?.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {resume.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Content Header with Controls */}
            <div className="bg-white border-b border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">
                  {availableTabs.find(tab => tab.id === activeTab)?.label}
                </h3>

                {/* Content-specific controls */}
                {activeTab === "pdf" && hasPdf && !pdfError && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Zoom Out"
                      >
                        <FaSearchMinus />
                      </button>
                      <span className="text-sm font-medium min-w-[60px] text-center">
                        {Math.round(scale * 100)}%
                      </span>
                      <button
                        onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Zoom In"
                      >
                        <FaSearchPlus />
                      </button>
                    </div>
                    {numPages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                          disabled={pageNumber <= 1}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                          title="Previous Page"
                        >
                          <FaChevronLeft />
                        </button>
                        <span className="text-sm font-medium">
                          {pageNumber} / {numPages}
                        </span>
                        <button
                          onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                          disabled={pageNumber >= numPages}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                          title="Next Page"
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Content Display */}
            <div className="flex-1 overflow-hidden bg-gray-50">
              {activeTab === "text" && hasText && (
                <div className="h-full bg-white m-4 rounded-lg shadow-sm overflow-hidden">
                  <TinyMCEViewer content={resume.textContent} className="h-full" debug={true} />
                </div>
              )}

              {activeTab === "pdf" && hasPdf && (
                <div className="h-full flex items-center justify-center p-4">
                  {pdfError ? (
                    <div className="text-center max-w-md">
                      <div className="text-red-500 text-6xl mb-4">📄❌</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        PDF Loading Error
                      </h3>
                      <p className="text-gray-600 mb-4">{pdfError}</p>
                      <button
                        onClick={() => handleDownload("pdfFile")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaDownload className="inline mr-2" />
                        Download PDF
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl w-full">
                      <Document
                        file={resume.pdfFile.url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                          <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-2">Loading PDF...</span>
                          </div>
                        }
                      >
                        <Page pageNumber={pageNumber} scale={scale} />
                      </Document>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "docx" && hasDocx && (
                <div className="h-full bg-white m-4 rounded-lg shadow-sm overflow-hidden">
                  <DocxViewer url={resume.docxFile.url} className="w-full h-full" />
                </div>
              )}

              {activeTab === "video" && hasVideo && (
                <div className="h-full flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl w-full">
                    <video
                      src={resume.videoFile.url}
                      controls
                      className="w-full rounded-lg"
                      preload="metadata"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernResumeViewer;
