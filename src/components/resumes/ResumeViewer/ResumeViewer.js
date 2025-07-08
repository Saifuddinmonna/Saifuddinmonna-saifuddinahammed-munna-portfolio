import React, { useState, useEffect, lazy, Suspense, useRef } from "react";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation, useNavigate } from "react-router-dom";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./ResumeViewer.css";
import { resumeAPI, resumeApiPdf, resumeApiDoxc } from "../../../services/apiService";
import TinyMCEViewer from "../../ui/TinyMCEViewer";
import DocxViewer from "../../ui/DocxViewer";
// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// Format date utility
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

const ResumeViewer = () => {
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeIdx, setSelectedResumeIdx] = useState(0);
  const [activeTab, setActiveTab] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageRefs = useRef([]);

  useEffect(() => {
    // Check system dark mode preference
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeMediaQuery.matches);
    const handleDarkModeChange = e => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
  }, []);

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await resumeAPI.getAllResumes();
        setResumes(res.data || []);
        // Set default selected resume and tab
        if (res.data && res.data.length > 0) {
          setSelectedResumeIdx(0);
          setActiveTab(getFirstAvailableTab(res.data[0]));
        }
      } catch (err) {
        setError(err.message || "Failed to fetch resumes");
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  useEffect(() => {
    // When selected resume changes, reset tab and page
    if (resumes.length > 0) {
      setActiveTab(getFirstAvailableTab(resumes[selectedResumeIdx]));
      setPageNumber(1);
      setScale(1.0);
    }
  }, [selectedResumeIdx, resumes]);

  useEffect(() => {
    if (pageRefs.current[pageNumber - 1]) {
      pageRefs.current[pageNumber - 1].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pageNumber]);

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
    if (resume.htmlFile?.url) tabs.push({ id: "html", title: "HTML", icon: /* svg */ null });
    if (resume.pdfFile?.url) tabs.push({ id: "pdf", title: "PDF", icon: /* svg */ null });
    if (resume.docxFile?.url) tabs.push({ id: "docx", title: "DOCX", icon: /* svg */ null });
    if (resume.videoFile?.url) tabs.push({ id: "video", title: "Video", icon: /* svg */ null });
    if (resume.textContent) tabs.push({ id: "text", title: "Text", icon: /* svg */ null });
    return tabs;
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!resumes.length) return <div className="text-center mt-8">No resumes found.</div>;

  const selectedResume = resumes[selectedResumeIdx];
  const availableTabs = getAvailableTabs(selectedResume);

  // Debug: Log the PDF file URL
  if (selectedResume && selectedResume.pdfFile && selectedResume.pdfFile.url) {
    console.log("PDF File URL:", selectedResume.pdfFile.url);
  }

  return (
    <div className="resumeViewerContainer flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-6">
      {/* Sidebar: Resume List */}
      <div className="w-full md:w-64 space-y-4">
        <div className="bg-background-default rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-main to-secondary-main p-2">
            <h2 className="text-lg font-semibold text-white/80">All Resumes</h2>
          </div>
          <div className="p-2 space-y-1.5">
            {resumes.map((resume, idx) => (
              <button
                key={resume._id}
                className={`resume-list-btn${idx === selectedResumeIdx ? " selected" : ""}`}
                onClick={() => setSelectedResumeIdx(idx)}
              >
                {resume.name}{" "}
                {resume.versionName && <span className="text-xs ml-2">({resume.versionName})</span>}
              </button>
            ))}
          </div>
        </div>
        {/* Sidebar: Details for selected resume */}
        <div className="bg-background-default rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-main to-secondary-main p-2">
            <h2 className="text-lg font-semibold text-white/80">Resume Info</h2>
          </div>
          <div className="p-2 space-y-1.5 text-sm text-text-primary">
            <p>
              <b>Name:</b> {selectedResume.name}
            </p>
            {selectedResume.versionName && (
              <p>
                <b>Version:</b> {selectedResume.versionName}
              </p>
            )}
            {selectedResume.summary && (
              <p>
                <b>Summary:</b> {selectedResume.summary}
              </p>
            )}
            {/* Date fields */}
            {selectedResume.originalCreationDate && (
              <p>
                <b>First Uploaded:</b> {formatDate(selectedResume.originalCreationDate)}
              </p>
            )}
            {selectedResume.createdAt && (
              <p>
                <b>Created At:</b> {formatDate(selectedResume.createdAt)}
              </p>
            )}
            {selectedResume.updatedAt && (
              <p>
                <b>Last Updated:</b> {formatDate(selectedResume.updatedAt)}
              </p>
            )}
            <p>
              <b>Files:</b>
            </p>
            <ul className="ml-4 list-disc">
              {selectedResume.htmlFile?.url && <li>HTML</li>}
              {selectedResume.pdfFile?.url && <li>PDF</li>}
              {selectedResume.docxFile?.url && <li>DOCX</li>}
              {selectedResume.videoFile?.url && <li>Video</li>}
            </ul>
            <div className="pt-2 border-t border-border-main">
              <p className="font-medium mb-2">Download:</p>
              <div className="flex flex-wrap gap-2">
                {selectedResume.pdfFile?.url && (
                  <a
                    target="_parent"
                    href={resumeApiPdf(selectedResume._id)}
                    download
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    PDF
                  </a>
                )}
                {selectedResume.docxFile?.url && (
                  <a
                    target="_blank"
                    bla
                    href={resumeApiDoxc(selectedResume._id)}
                    download
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    DOCX
                  </a>
                )}
                {selectedResume.videoFile?.url && (
                  <a
                    href={selectedResume.videoFile.url}
                    download
                    className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                  >
                    Video
                  </a>
                )}
                {selectedResume.htmlFile?.url && (
                  <a
                    href={selectedResume.htmlFile.url}
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
      <div className="flex-1">
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
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300 hover:text-blue-500 hover:border-blue-500"
                }`}
              >
                <span>{tab.title}</span>
              </button>
            ))}
          </div>
          {/* Download/View PDF buttons inline with tabs */}
          {activeTab === "pdf" && selectedResume.pdfFile?.url && (
            <div className="flex gap-2 ml-4">
              <a
                href={resumeApiPdf(selectedResume._id)}
                download
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Download PDF
              </a>
              <a
                href={resumeApiPdf(selectedResume._id)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-primary-main text-white rounded hover:bg-primary-dark transition"
              >
                View PDF
              </a>
            </div>
          )}
        </div>
        {/* Tab Content */}
        <div className="bg-background-default rounded-xl shadow-xl overflow-hidden relative">
          {/* Top right buttons */}
          <div className="absolute top-0 right-0 flex gap-2 p-4 z-10">
            {activeTab === "docx" && selectedResume.docxFile?.url && (
              <>
                <a
                  href={selectedResume.docxFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-primary-main text-white rounded hover:bg-primary-dark transition"
                >
                  View DOCX
                </a>
                <a
                  href={resumeApiDoxc(selectedResume._id)}
                  download
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Download DOCX
                </a>
              </>
            )}
            {activeTab === "video" && selectedResume.videoFile?.url && (
              <>
                <a
                  href={selectedResume.videoFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-primary-main text-white rounded hover:bg-primary-dark transition"
                >
                  View Video
                </a>
                <a
                  href={selectedResume.videoFile.url}
                  download
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                >
                  Download Video
                </a>
              </>
            )}
            {activeTab === "html" && selectedResume.htmlFile?.url && (
              <>
                <a
                  href={selectedResume.htmlFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-primary-main text-white rounded hover:bg-primary-dark transition"
                >
                  View HTML
                </a>
                <a
                  href={selectedResume.htmlFile.url}
                  download
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Download HTML
                </a>
              </>
            )}
            {activeTab === "text" && selectedResume.textContent && (
              <button
                onClick={() => {}}
                className="px-3 py-1 bg-primary-main text-white rounded cursor-default"
              >
                View Text
              </button>
            )}
          </div>
          {activeTab === "html" && selectedResume.htmlFile?.url && (
            <iframe
              src={selectedResume.htmlFile.url}
              className="w-full h-[800px] rounded-lg shadow-xl bg-background-default"
              title="HTML Resume"
            />
          )}
          {activeTab === "pdf" && selectedResume.pdfFile?.url && (
            <div className="flex flex-col items-center w-full">
              {/* PDF Zoom Controls */}
              <div className="w-full bg-gradient-to-r from-primary-main to-secondary-main p-2 rounded-t-lg">
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
              {isLoading && (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-main"></div>
                </div>
              )}
              <div className="relative w-full flex flex-col items-center mt-2 max-h-[800px] overflow-y-auto">
                <Document
                  file={selectedResume.pdfFile.url}
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
          {activeTab === "docx" && selectedResume.docxFile?.url && (
            <div className="h-[800px] bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
              <DocxViewer url={selectedResume.docxFile.url} className="h-full" />
            </div>
          )}
          {activeTab === "video" && selectedResume.videoFile?.url && (
            <video
              src={selectedResume.videoFile.url}
              controls
              className="w-full rounded-b-lg shadow-xl"
            />
          )}
          {activeTab === "text" && selectedResume.textContent && (
            <div className="p-6 bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
              <TinyMCEViewer content={selectedResume.textContent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;
