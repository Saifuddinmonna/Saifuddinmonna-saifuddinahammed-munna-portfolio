import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation } from "react-router-dom";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResumeViewer = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("html");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const resumeData = {
    html: {
      title: "HTML Resume",
      url: "/documents/myCv/resume of Saifuddin Ahammed.html",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    cv: {
      title: "CV",
      url: "/documents/myCv/cv for saifuddin ahmmed monna.html",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    singlePage: {
      title: "Single Page Resume",
      url: "/documents/myCv/singlePage resume of Saifuddin Ahammed Monna.html",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    pdf: {
      title: "PDF Resume",
      url: "/documents/myCv/_resume of Saifuddin Ahammed Monna.pdf",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    cvPdf: {
      title: "CV PDF",
      url: "/documents/myCv/cv for saifuddin ahmmed monna.pdf",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    video: {
      title: "Video Resume",
      url: "/documents/myCv/video-resume.mp4",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  };

  const renderContent = () => {
    switch (activeTab) {
      case "html":
      case "cv":
      case "singlePage":
        return (
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 p-3 rounded-t-lg">
              <p className="text-sm text-white font-medium flex items-center">
                {resumeData[activeTab].icon}
                <span className="ml-2">Viewing: {resumeData[activeTab].title}</span>
              </p>
            </div>
            <iframe
              src={resumeData[activeTab].url}
              className="w-full h-[800px] rounded-lg shadow-xl mt-12"
              title={`${resumeData[activeTab].title}`}
            />
          </div>
        );
      case "pdf":
      case "cvPdf":
        return (
          <div className="flex flex-col items-center">
            <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 p-2 rounded-t-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-white font-medium flex items-center">
                  {resumeData[activeTab].icon}
                  <span className="ml-2">Viewing: {resumeData[activeTab].title}</span>
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                    <button
                      onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                      className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors"
                      title="Zoom Out"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <div className="flex items-center gap-1">
                      {zoomLevels.map(level => (
                        <button
                          key={level}
                          onClick={() => setScale(level)}
                          className={`px-1.5 py-0.5 text-xs rounded transition-colors ${
                            scale === level
                              ? "bg-white text-blue-600"
                              : "text-white hover:bg-white/20"
                          }`}
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {isLoading && (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            <Document
              file={resumeData[activeTab].url}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center mt-2"
              loading={null}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-xl"
                scale={scale}
              />
            </Document>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
                className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg disabled:opacity-50 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
              >
                Previous
              </button>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Page {pageNumber} of {numPages}
              </p>
              <button
                onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                disabled={pageNumber >= numPages}
                className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg disabled:opacity-50 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 p-3 rounded-t-lg">
              <p className="text-sm text-white font-medium flex items-center">
                {resumeData.video.icon}
                <span className="ml-2">Viewing: {resumeData.video.title}</span>
              </p>
            </div>
            <video
              controls
              className="w-full max-w-4xl rounded-lg shadow-xl mt-12"
              src={resumeData.video.url}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Resume Collection
            </h1>
            <div className="flex space-x-4">
              {Object.keys(resumeData).map(tab => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {resumeData[tab].icon}
                  <span className="ml-2">{resumeData[tab].title}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              {renderContent()}
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="w-64 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4">
                <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-2">
                <a
                  href={resumeData.html.url}
                  download
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download HTML Resume
                </a>
                <a
                  href={resumeData.cv.url}
                  download
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download HTML CV
                </a>
                <a
                  href={resumeData.singlePage.url}
                  download
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-lg hover:from-purple-700 hover:to-indigo-600 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Single Page Resume
                </a>
                <a
                  href={resumeData.pdf.url}
                  download
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-lg hover:from-red-700 hover:to-pink-600 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF Resume
                </a>
                <a
                  href={resumeData.cvPdf.url}
                  download
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-yellow-500 text-white rounded-lg hover:from-orange-700 hover:to-yellow-600 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF CV
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4">
                <h2 className="text-lg font-semibold text-white">Resume Info</h2>
              </div>
              <div className="p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Last Updated: March 2024
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Available Formats: HTML, PDF, Video
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                  Total Files: 6 Documents
                </p>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-medium mb-2">File Details:</p>
                  <ul className="space-y-1">
                    <li className="flex justify-between">
                      <span>HTML Resume:</span>
                      <span>23KB</span>
                    </li>
                    <li className="flex justify-between">
                      <span>HTML CV:</span>
                      <span>43KB</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Single Page Resume:</span>
                      <span>15KB</span>
                    </li>
                    <li className="flex justify-between">
                      <span>PDF Resume:</span>
                      <span>144KB</span>
                    </li>
                    <li className="flex justify-between">
                      <span>PDF CV:</span>
                      <span>329KB</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-medium mb-2">Features:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Interactive PDF Viewer
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Zoom Controls
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Multiple Formats
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Direct Downloads
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;
