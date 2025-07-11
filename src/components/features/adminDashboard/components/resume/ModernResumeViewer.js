import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import TinyMCEViewer from "../../../../ui/TinyMCEViewer";
import DocxViewer from "../../../../ui/DocxViewer";
import { FaDownload } from "react-icons/fa";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const formatDate = dateString => {
  if (!dateString) return "N/A";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return (
    new Date(dateString).toLocaleDateString(undefined, options) +
    " " +
    new Date(dateString).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
};

const ModernResumeViewer = ({ open, onClose, resume, onEdit, onBack }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const pageRefs = useRef([]);

  useEffect(() => {
    if (resume) {
      setActiveTab(getFirstAvailableTab(resume));
      setPageNumber(1);
      setScale(1.0);
    }
  }, [resume]);

  useEffect(() => {
    if (pageRefs.current[pageNumber - 1]) {
      pageRefs.current[pageNumber - 1].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pageNumber]);

  if (!open || !resume) return null;

  const getFirstAvailableTab = resume => {
    if (!resume) return null;
    if (resume.textContent) return "text";
    if (resume.docxFile?.url) return "docx";
    if (resume.htmlFile?.url) return "html";
    if (resume.pdfFile?.url) return "pdf";
    if (resume.videoFile?.url) return "video";
    return null;
  };

  const getAvailableTabs = resume => {
    if (!resume) return [];
    const tabs = [];
    if (resume.htmlFile?.url) tabs.push({ id: "html", title: "HTML" });
    if (resume.pdfFile?.url) tabs.push({ id: "pdf", title: "PDF" });
    if (resume.docxFile?.url) tabs.push({ id: "docx", title: "DOCX" });
    if (resume.videoFile?.url) tabs.push({ id: "video", title: "Video" });
    if (resume.textContent) tabs.push({ id: "text", title: "Text" });
    return tabs;
  };

  const availableTabs = getAvailableTabs(resume);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background-default)] bg-opacity-90">
      <div className="w-full h-full max-w-7xl max-h-[95vh] bg-[var(--background-paper)] shadow-2xl overflow-hidden relative flex flex-col md:flex-row p-4 rounded-xl">
        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0 space-y-4">
          <div className="bg-[var(--background-default)] rounded-xl shadow-xl overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)] p-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/80">Resume Info</h2>
              {onEdit && (
                <button
                  onClick={() => onEdit(resume)}
                  className="ml-2 px-3 py-1 bg-[var(--primary-main)] text-white rounded hover:bg-[var(--primary-dark)] transition text-sm font-semibold"
                  title="Edit Resume"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="p-2 space-y-1.5 text-sm text-[var(--text-primary)]">
              <p>
                <b>Name:</b> {resume.name}
              </p>
              {resume.versionName && (
                <p>
                  <b>Version:</b> {resume.versionName}
                </p>
              )}
              {resume.summary && (
                <p>
                  <b>Summary:</b> {resume.summary}
                </p>
              )}
              {resume.originalCreationDate && (
                <p>
                  <b>First Uploaded:</b> {formatDate(resume.originalCreationDate)}
                </p>
              )}
              {resume.createdAt && (
                <p>
                  <b>Created At:</b> {formatDate(resume.createdAt)}
                </p>
              )}
              {resume.updatedAt && (
                <p>
                  <b>Last Updated:</b> {formatDate(resume.updatedAt)}
                </p>
              )}
              <p>
                <b>Files:</b>
              </p>
              <ul className="ml-4 list-disc">
                {resume.htmlFile?.url && <li>HTML</li>}
                {resume.pdfFile?.url && <li>PDF</li>}
                {resume.docxFile?.url && <li>DOCX</li>}
                {resume.videoFile?.url && <li>Video</li>}
              </ul>
              <div className="pt-2 border-t border-[var(--border-main)]">
                <p className="font-medium mb-2">Download:</p>
                <div className="flex flex-wrap gap-2">
                  {resume.pdfFile?.url && (
                    <a
                      href={resume.pdfFile.url}
                      download
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      PDF
                    </a>
                  )}
                  {resume.docxFile?.url && (
                    <a
                      href={resume.docxFile.url}
                      download
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      DOCX
                    </a>
                  )}
                  {resume.videoFile?.url && (
                    <a
                      href={resume.videoFile.url}
                      download
                      className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                    >
                      Video
                    </a>
                  )}
                  {resume.htmlFile?.url && (
                    <a
                      href={resume.htmlFile.url}
                      download
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      HTML
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {availableTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg font-semibold"
                      : "bg-[var(--background-elevated)] text-[var(--text-primary)] hover:bg-[var(--background-default)] border border-[var(--border-main)] hover:text-[var(--primary-main)] hover:border-[var(--primary-main)]"
                  }`}
                >
                  <span>{tab.title}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Tab Content */}
          <div className="bg-[var(--background-default)] rounded-xl shadow-xl overflow-hidden relative flex-1">
            {activeTab === "html" && resume.htmlFile?.url && (
              <iframe
                src={resume.htmlFile.url}
                className="w-full h-[800px] rounded-lg shadow-xl bg-[var(--background-default)]"
                title="HTML Resume"
              />
            )}
            {activeTab === "pdf" && resume.pdfFile?.url && (
              <div className="flex flex-col items-center w-full">
                {/* PDF Zoom Controls */}
                <div className="w-full bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)] p-2 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-white font-medium flex items-center">PDF Resume</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                        <button
                          onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                          className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors"
                          title="Zoom Out"
                        >
                          -
                        </button>
                        <div className="flex items-center gap-1">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map(level => (
                            <button
                              key={level}
                              onClick={() => setScale(level)}
                              className={`resume-pdf-zoom-btn${scale === level ? " selected" : ""}`}
                            >
                              {Math.round(level * 100)}%
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
                          className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors"
                          title="Zoom In"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative w-full flex flex-col items-center mt-2 max-h-[800px] overflow-y-auto">
                  <Document
                    file={resume.pdfFile.url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="resume-pdf-document"
                    loading={null}
                  >
                    <div className="relative w-full flex flex-col items-center">
                      {Array.from({ length: numPages }, (_, idx) => {
                        return (
                          <div
                            key={idx}
                            ref={el => (pageRefs.current[idx] = el)}
                            style={{ marginBottom: "2rem" }}
                          >
                            <Page
                              pageNumber={idx + 1}
                              renderTextLayer={true}
                              renderAnnotationLayer={true}
                              className="resume-pdf-page"
                              scale={scale}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Document>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="resume-pager-btn"
                  >
                    Previous
                  </button>
                  <p className="resume-pager-info">
                    Page {pageNumber} of {numPages}
                  </p>
                  <button
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                    disabled={pageNumber >= numPages}
                    className="resume-pager-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {activeTab === "docx" && resume.docxFile?.url && (
              <div className="h-[800px] bg-[var(--background-paper)] text-[var(--text-primary)] transition-colors duration-200">
                <DocxViewer url={resume.docxFile.url} className="h-full" />
              </div>
            )}
            {activeTab === "video" && resume.videoFile?.url && (
              <video
                src={resume.videoFile.url}
                controls
                className="w-full rounded-b-lg shadow-xl"
              />
            )}
            {activeTab === "text" && resume.textContent && (
              <div
                className="p-6 bg-[var(--background-paper)] text-[var(--text-primary)] transition-colors duration-200 h-full overflow-y-auto"
                style={{ maxHeight: "700px" }}
              >
                <TinyMCEViewer content={resume.textContent} />
              </div>
            )}
          </div>
        </div>
        {/* Top Right Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-full shadow hover:bg-[var(--background-default)] transition"
              title="Back"
            >
              ←
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 bg-[var(--background-elevated)] text-[var(--text-primary)] rounded-full shadow hover:bg-[var(--background-default)] transition"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernResumeViewer;
