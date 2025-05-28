import React, { useState } from "react";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResumeViewer = () => {
  const [activeTab, setActiveTab] = useState("html");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const resumeData = {
    html: {
      title: "HTML Resume",
      url: "/documents/myCv/resume of Saifuddin Ahammed.html",
    },
    pdf: {
      title: "PDF Resume",
      url: "/documents/myCv/Saifuddin Ahammed Munna.pdf",
    },
    video: {
      title: "Video Resume",
      url: "/documents/myCv/video-resume.mp4",
    },
  };

  const renderContent = () => {
    switch (activeTab) {
      case "html":
        return (
          <iframe
            src={resumeData.html.url}
            className="w-full h-[800px] rounded-lg shadow-lg"
            title="HTML Resume"
          />
        );
      case "pdf":
        return (
          <div className="flex flex-col items-center">
            <Document
              file={resumeData.pdf.url}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
              />
            </Document>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-gray-700">
                Page {pageNumber} of {numPages}
              </p>
              <button
                onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                disabled={pageNumber >= numPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        );
      case "video":
        return (
          <video
            controls
            className="w-full max-w-4xl rounded-lg shadow-lg"
            src={resumeData.video.url}
          >
            Your browser does not support the video tag.
          </video>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Resume Collection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            View my professional experience in different formats
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800">
            {Object.keys(resumeData).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {resumeData[tab].title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
        >
          {renderContent()}
        </motion.div>

        {/* Download Options */}
        <div className="mt-8 flex justify-center gap-4">
          <a
            href={resumeData.html.url}
            download
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            href={resumeData.pdf.url}
            download
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;
